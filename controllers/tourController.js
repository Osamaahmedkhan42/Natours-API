const Tour = require('../models/tourModel')






exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find()
        res.status(200).json({
            status: 'Sucess',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {

        res.status(404).json({
            status: "failed!",
            message: error
        })
    }

};

exports.getTour = async (req, res) => {
    try {
        console.log(req.params.id)
        const tours = await Tour.findById(req.params.id)
        //const tours = await Tour.findOne({ name: req.params.id })
        res.status(200).json({
            status: 'Sucess',
            // results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {

        res.status(404).json({
            status: "failed!",
            message: error
        })
    }

};

exports.createTour = async (req, res) => {
    // console.log(req.body);
    //const newTour = new Tour()
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'Sucess',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "failed!",
            message: "Error invalid data"
        })


    }



};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json({
            status: 'Sucess',

            data: {
                tour
            }
        })
    } catch (error) {

        res.status(404).json({
            status: "failed!",
            message: error
        })
    }

};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'Sucess',
            data: null
        })
    } catch (error) {

        res.status(404).json({
            status: "failed!",
            message: error
        })
    }

};