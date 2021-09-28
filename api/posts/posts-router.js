// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
    Posts.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: "The posts information could not be retrieved" }))
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        !post ? res.status(404).json({ message: "The post with the specified ID does not exist" })
        : res.json(post)
    } catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.post('/', async (req, res) => {
    try {
        const newPost = req.body

        if (!newPost.title || !newPost.contents) {
           res.status(400).json({ message: "Please provide title and contents for the post" }) 
        } else {
            const postId = await Posts.insert(newPost)
            const post = await Posts.findById(postId) 
            res.status(201).json(post)
        }
    } catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const updated = req.body

        if (!updated.title || !updated.contents) {
           res.status(400).json({ message: "Please provide title and contents for the post" }) 
        } else {
            const updatedPost = await Posts.update(req.params.id, updated)

            !updatedPost ? res.status(404).json({ message: "The post with the specified ID does not exist" })
            : res.status(200).json(updatedPost)
            }
    } catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Posts.remove(req.params.id)

        !deleted ? res.status(404).json({ message: "The post with the specified ID does not exist" })
        : res.status(200).json(deleted)
    } catch(err) {
        res.status(500).json({message: "The post could not be removed"})
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const comments = Posts.findPostComments(req.params.id)
            res.status(200).json(comments)
        }
    } catch(err) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router