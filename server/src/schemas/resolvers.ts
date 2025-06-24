import   User  from '../models/index.js'
import { signToken, AuthenticationError } from '../services/auth.js';

interface UserType {
    username: string;
    email: string;
    password: string;
    savedBooks: Book[]
}

interface Book {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
}
interface Auth {
    token: string
    user: UserType
}



const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('Not Authenticated')
            }
            const userDoc = await User.findOne({
                _id: context.user._id
            });
            if (!userDoc) {
                return null
            }
            
            return userDoc; 
        },
        user: async (_parent: unknown, args: {id?: string; username?: string}) => {
            const userDoc = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }]
            });
            if (!userDoc) {
                return null
            }
            
            return userDoc;
        },
    },
    Mutation: {
        createUser: async (_parent: unknown, args: {username: string; email: string; password: string}): Promise<Auth | null> => {
            const user = await User.create(args);
            if(!user) {
                throw new Error('Something went wrong!');
            }
            const token = signToken(user.username, user.password, user._id);
            return  { token, user } ;
        },
        login: async (_parent: unknown, args: {username?: string; email?: string; password: string}): Promise<Auth | null> => {
            const user = await User.findOne({
                $or: [{username: args.username}, {email: args.email}],
            });
            if(!user) {
                throw new AuthenticationError("Can't find this user")
            }
            const correctPw = await user.isCorrectPassword(args.password)
            if (!correctPw) {
                throw new AuthenticationError("Incorrect Password")
            }
            const token = signToken(user.username, user.password, user._id);
            return { token, user }
        },
        saveBook: async(_parent: unknown, args: {book: Book}, context: any) => {
            if(!context.user) {
                throw new AuthenticationError("Not Authenticated");
            }
            const updateUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet: {savedBooks: args.book} },
                { new: true, runValidators: true}
            );
            return updateUser
        },
        deleteBook: async (_parent: unknown, args: {bookId: string}, context: any) => {
            if(!context.user) {
                throw new AuthenticationError("Not Authenticated")
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: {bookId: args.bookId} } },
                { new: true }
            );
            if(!updatedUser) {
                throw new Error("Couldn't find user with this id!");
            }
            return updatedUser;
        }
    }
    
}

export default resolvers;