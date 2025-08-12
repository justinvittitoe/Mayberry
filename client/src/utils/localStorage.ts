export const getSavedHomeIds = () => {
  const savedHomeIds = localStorage.getItem('saved_homes')
    ? JSON.parse(localStorage.getItem('saved_homes')!)
    : [];

  return savedHomeIds;
};

export const saveHomeIds = (homeIdArr: string[]) => {
  if (homeIdArr.length) {
    localStorage.setItem('saved_homes', JSON.stringify(homeIdArr));
  } else {
    localStorage.removeItem('saved_homes');
  }
};

export const removeHomeId = (homeId: string) => {
  const savedHomeIds = localStorage.getItem('saved_homes')
    ? JSON.parse(localStorage.getItem('saved_homes')!)
    : null;

  if (!savedHomeIds) {
    return false;
  }

  const updatedSavedHomeIds = savedHomeIds?.filter((savedHomeId: string) => savedHomeId !== homeId);
  localStorage.setItem('saved_homes', JSON.stringify(updatedSavedHomeIds));

  return true;
};



