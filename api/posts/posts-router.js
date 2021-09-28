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

router.post('/', (req,res) => {
    const newPost = req.body
    !newPost.title || !newPost.contents ? 
    res.status(400).json({ message: "Please provide title and contents for the post" })
    : Posts.insert(newPost)
        .then(({ id }) => {
            return Posts.findById(id)
        })
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
})

router.put('/:id', (req,res) => {
    const { title, contents } = req.body
    const { id } = req.params
    
    !title || !contents ? 
    res.status(400).json({ message: "Please provide title and contents for the post" })
    : Posts.findById(id)
        .then(post => {
            if(!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                return Posts.update(id, req.body)
            }
        })
        .then(result => {if (result) {
            return Posts.findById(id)
        }
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be modified" })
        })
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)

        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            await Posts.remove(req.params.id)
            res.status(200).json(post)
        }
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
            const comments = await Posts.findPostComments(req.params.id)
            res.status(200).json(comments)
        }
    } catch(err) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router