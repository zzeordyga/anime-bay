import { generateUUID } from "../utils/uuid";

const SUPER_SECRET_VALUE = '@';

const validateName = (string) => {
    if (string.length === 0) {
        return false;
    }

    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (format.test(string)) {
        return false;
    } else {
        return true;
    }
};

export const createCollection = (key) => {
    if (localStorage.getItem(key)) {
        return {
            error: "Collection already exists!"
        };
    }

    if (!validateName(key)) {
        return {
            error: "Name cannot have any special characters!"
        };
    }

    localStorage.setItem(key, JSON.stringify([]));

    return {
        success: 'Success!',
        result: [],
    }
}

export const createCollectionWithItem = (key, item) => {
    if (localStorage.getItem(key)) {
        return {
            error: "Collection already exists!"
        };
    }

    if (!validateName(key)) {
        return {
            error: "Name cannot have any special characters!"
        };
    }

    let array = [item];

    localStorage.setItem(key, JSON.stringify(array));

    // Get UUID from Anime 
    const newKey = item.id ? generateUUID(item.id + '') : generateUUID(JSON.stringify(item));
    let newCollection = getItem(newKey);

    // Adding collection name
    if (newCollection) {
        localStorage.setItem(newKey, JSON.stringify([...newCollection, key]));
    }
    else {
        newCollection = [SUPER_SECRET_VALUE];
        localStorage.setItem(newKey, JSON.stringify([SUPER_SECRET_VALUE, key]));
    }

    return {
        success: 'Success!',
        result: array,
    }
}

export const getAllCollection = () => {
    const length = typeof window !== 'undefined' ? localStorage.length : 0;
    const collections = [];

    for (let index = 0; index < length; index++) {
        const key = localStorage.key(index);

        const array = getItem(key);

        if ((Array.isArray(array) && !key.includes(SUPER_SECRET_VALUE)) && !array.hasOwnProperty('userAgent'))
            collections.push({ name: key, array });
    }

    return collections;
}

export const putItems = (key, item) => {
    const array = getItem(key);

    if (array) {
        const newArray = [...array, item];
        localStorage.setItem(key, JSON.stringify(newArray));

        // Get UUID from Anime 
        const newKey = item.id ? generateUUID(item.id + '') : generateUUID(JSON.stringify(item));
        let newCollection = getItem(newKey);

        // Adding collection name
        if (newCollection) {
            localStorage.setItem(newKey, JSON.stringify([...newCollection, key]));
        }
        else {
            newCollection = [SUPER_SECRET_VALUE];
            localStorage.setItem(newKey, JSON.stringify([SUPER_SECRET_VALUE, key]));
        }

        return {
            success: 'Success!',
            result: newArray,
            collections: [...newCollection, key],
        };
    } else {
        return {
            error: "Failed putting items in!"
        };
    }
}

export const getItem = (key) => {
    const item = localStorage.getItem(key);
    if (!item) {
        return null;
    }

    return JSON.parse(item);
}

export const getCollectionsByItem = (id) => {
    const result = getItem(id + SUPER_SECRET_VALUE);

    if (result) {
        result.splice(result.indexOf(SUPER_SECRET_VALUE), 1);
        return {
            success: "Success!",
            array: result,
        };
    }

    return {
        error: "No collection!",
        array: []
    }
}

export const updateCollection = (key, newKey) => {
    const item = localStorage.getItem(key);
    console.log('Key : ' + key);
    console.log('New Key : ' + newKey);
    console.log(item);

    const itemArray = getItem(key);

    if (getItem(newKey))
        return {
            error: "Key already exists!",
        };

    localStorage.setItem(newKey, item);
    localStorage.removeItem(key);

    itemArray.forEach(item => {
        const itemKey = item.id + SUPER_SECRET_VALUE;
        const itemCollections = getItem(itemKey);
        const index = itemCollections.indexOf(key);
        if (index !== -1) {
            itemCollections.splice(index, 1);
        }
        itemCollections.push(newKey);

        localStorage.setItem(itemKey, JSON.stringify(itemCollections));
    });

    return {
        success: "Success!",
        array: getItem(newKey),
    }
}

export const removeCollection = (key) => {
    const item = getItem(key);

    if (!item) {
        return {
            error: "Item not available!"
        }
    }

    item.forEach(i => {
        removeItem(key, i);
    });

    localStorage.removeItem(key);

    return {
        success: "Success!",
        array: item,
    }
}

export const removeItem = (key, item) => {
    const array = getItem(key);

    // UUID from Anime id
    const newKey = item.id ? generateUUID(item.id + '') : generateUUID(JSON.stringify(item));
    const collectionArray = getItem(newKey);

    if (!array || !collectionArray) {
        return {
            error: 'No array!',
            array,
            collectionArray
        }
    }

    const remainingArray = array.filter(data => data.id != item.id);
    const remainingCollectionArray = collectionArray.filter(data => data != key);

    localStorage.setItem(key, JSON.stringify(remainingArray));
    localStorage.setItem(newKey, JSON.stringify(remainingCollectionArray));

    return {
        success: "Success!",
        array: remainingArray,
        collectionArray: remainingCollectionArray,
    }
}