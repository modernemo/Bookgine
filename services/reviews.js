import fs from 'fs';
import { readDB, writeDB} from '../controllers/control.js';

export const getReviewsByUserId = (id) => {
    const data = readDB();
    const reviews = data.reviews;
    console.log(reviews)
    try {
        return reviews.filter(x => x.user_id === Number(id));
    } catch {
        return null;
    }
}

export const getReviewByReviewId = (id, user_id) => {
    const data = readDB();
    const reviews = data.reviews;
    console.log(reviews)
    try {
        return reviews.find(x => x.id === Number(id) & x.user_id === Number(user_id));
    } catch {
        return null;
    }
}