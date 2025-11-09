import { Types } from 'mongoose';
import InteriorPackage, { InteriorPackageDocument } from '../models/OptionSchemas/InteriorPackageOption';
import InteriorOption from '../models/OptionSchemas/InteriorOption';

/**
 * Calculate total cost of a package by summing all option costs
 * Includes softClose price if enabled
 */
export async function calculatePackageTotalCost(
    packageDoc: InteriorPackageDocument
): Promise<number> {
    await packageDoc.populate([
        'fixtures',
        'lvp',
        'carpet',
        'backsplash',
        'masterBathTile',
        'secondaryBathTile',
        'countertop',
        'primaryCabinets',
        'secondaryCabinets',
        'cabinetHardware',
    ]);

    let totalCost = 0;

    const addOptionCost = (option: any) => {
        if (option?.cost) {
            totalCost += option.cost;

            // Add softClose price if enabled and option is a cabinet
            if (packageDoc.softClose && option.material === 'cabinet' && option.softClosePrice) {
                totalCost += option.softClosePrice;
            }
        }
    };

    // Add all option costs
    addOptionCost(packageDoc.fixtures);
    addOptionCost(packageDoc.lvp);
    addOptionCost(packageDoc.carpet);
    addOptionCost(packageDoc.backsplash);
    addOptionCost(packageDoc.masterBathTile);
    addOptionCost(packageDoc.secondaryBathTile);
    addOptionCost(packageDoc.countertop);
    addOptionCost(packageDoc.primaryCabinets);
    addOptionCost(packageDoc.secondaryCabinets);
    addOptionCost(packageDoc.cabinetHardware);

    return totalCost;
}

/**
 * Calculate client price based on base package pricing formula:
 * clientPrice = (totalCost - basePackageTotalCost) * (1 + markup)
 * With minimum markup enforcement
 */
export async function calculatePackageClientPrice(
    packageDoc: InteriorPackageDocument,
    totalCost: number
): Promise<number> {
    // Find the base package for this plan
    const basePackage = await InteriorPackage.findOne({
        planId: packageDoc.planId,
        basePackage: true,
        isActive: true,
    });

    // If no base package exists, this becomes the base package
    if (!basePackage) {
        packageDoc.basePackage = true;
        return packageDoc.minMarkup; // Base package shows minMarkup as clientPrice
    }

    // If this IS the base package
    if (packageDoc.basePackage) {
        return packageDoc.minMarkup;
    }

    // Calculate add-to cost (delta from base package)
    const addToCost = totalCost - basePackage.totalCost;

    // Calculate markup amount: max((addToCost * (1 + markup)), minMarkup)
    const markupAmount = Math.max(addToCost * (1 + packageDoc.markup), packageDoc.minMarkup);

    // Final client price
    let clientPrice = addToCost + markupAmount;

    // Ensure client price is never negative (use minMarkup as floor)
    if (clientPrice < 0) {
        clientPrice = packageDoc.minMarkup;
    }

    return clientPrice;
}

/**
 * Recalculate a single package's total cost and client price
 */
export async function recalculatePackage(
    packageId: Types.ObjectId
): Promise<InteriorPackageDocument> {
    const package_ = await InteriorPackage.findById(packageId);

    if (!package_) {
        throw new Error('Package not found');
    }

    // Calculate total cost
    const totalCost = await calculatePackageTotalCost(package_);
    package_.totalCost = totalCost;

    // Calculate client price
    const clientPrice = await calculatePackageClientPrice(package_, totalCost);
    package_.clientPrice = clientPrice;

    await package_.save();

    // Re-populate for return
    await package_.populate([
        'fixtures',
        'lvp',
        'carpet',
        'backsplash',
        'masterBathTile',
        'secondaryBathTile',
        'countertop',
        'primaryCabinets',
        'secondaryCabinets',
        'cabinetHardware',
    ]);

    return package_;
}

/**
 * Recalculate all packages for a given plan
 * Used when base package changes
 */
export async function recalculateAllPackagesForPlan(
    planId: Types.ObjectId
): Promise<InteriorPackageDocument[]> {
    const packages = await InteriorPackage.find({ planId, isActive: true });

    const updatedPackages: InteriorPackageDocument[] = [];

    for (const package_ of packages) {
        const updated = await recalculatePackage(package_._id);
        updatedPackages.push(updated);
    }

    return updatedPackages;
}

/**
 * Determine and set the base package for a plan
 * Base package = lowest total cost package
 * If tie, maintain existing base package
 */
export async function determineBasePackage(
    planId: Types.ObjectId
): Promise<InteriorPackageDocument | null> {
    const packages = await InteriorPackage.find({ planId, isActive: true }).sort({
        totalCost: 1,
    });

    if (packages.length === 0) {
        return null;
    }

    const lowestCost = packages[0].totalCost;

    // Find all packages with the lowest cost
    const lowestCostPackages = packages.filter((pkg) => pkg.totalCost === lowestCost);

    // Check if any of them is already the base package
    const existingBase = lowestCostPackages.find((pkg) => pkg.basePackage);

    let newBasePackage: InteriorPackageDocument;

    if (existingBase) {
        // Maintain existing base package
        newBasePackage = existingBase;
    } else {
        // Set the first lowest-cost package as base
        newBasePackage = lowestCostPackages[0];

        // Remove base package flag from all others
        await InteriorPackage.updateMany({ planId }, { basePackage: false });

        // Set this as base
        newBasePackage.basePackage = true;
        await newBasePackage.save();
    }

    // Recalculate all packages for this plan
    await recalculateAllPackagesForPlan(planId);

    return newBasePackage;
}