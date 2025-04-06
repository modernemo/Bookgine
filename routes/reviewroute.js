import { Router } from "express";
import {getReviewsByUserId, getReviewByReviewId} from "../services/reviews.js";
import { readDB, writeDB } from "../controllers/control.js";

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/reviews');
})

router.get('/reviews', (req, res) => {
    const reviews = getReviewsByUserId(req.user.id)
     res.render('index', { reviews })
 })

 router.get('/reviews/add', (req, res) => {
    res.render('add', {review: null})
})

router.get('/reviews/:id/delete', (req, res) => {
    const data = readDB();
    const reviewId = Number(req.params.id);
    const userId = req.user.id;

    data.reviews = data.reviews.filter(
        r => !(r.id === reviewId && r.user_id === userId)
    );

    writeDB(data);
    res.redirect('/reviews');
});

router.get('/reviews/:id', (req, res) => {
    const review = getReviewByReviewId(req.params.id, req.user.id)
     res.render('detail', { review })
 })

router.get('/reviews/:id/edit', (req, res) => {
    const review = getReviewByReviewId(req.params.id, req.user.id)
    res.render('add', {review: review})
})

router.post('/reviews/:id/edit', (req, res) => {
    const data = readDB();
    console.log(data.reviews)
    const review = data.reviews.find(x => x.id === Number(req.params.id) & Number(x.user_id === req.user.id));
    console.log(review)
    review.body = req.body.body;
    review.rating = req.body.rating;
    writeDB(data);
    res.redirect('/reviews');
})

router.post('/reviews', (req, res) => {
    const data = readDB();
    let review = {
        id: data.reviews.sort(x => -x.id)[0].id + 1,
        body: req.body.body,
        rating: Number(req.body.rating),
        user_id: req.user.id,
    }
    data.reviews.push(review);
    writeDB(data);
    res.redirect('/reviews');
})

export default router;