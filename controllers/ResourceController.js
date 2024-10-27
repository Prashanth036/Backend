const { where } = require("sequelize");
const db = require("../models");

const createPainData = async (req, res) => {
    const { paintype, title, description, videolink, downloadlinks, weblinks } = req.body;
    // const imglink = req.file ? req.file.path : null;
    const imglink =req.file ? req.file.path.replace(/\\/g, '/'): null;

    try {
        const response = await db.Resource.create({
            paintype: paintype,
            title: title,
            description: description,
            videolink: videolink,
            downloadlinks: downloadlinks,
            weblinks: weblinks,
            imglink: imglink
        });

        if (response) {
            res.status(201).json(response);
        }
    } catch (error) {
        res.status(400).json({ message: "Error creating resource", error });
    }
};


const getPainData = async (req, res) => {
    const params=req.params
    console.log(params)
    try {
        const response = await db.Resource.findAll({where:{id:params.id}});
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: "Error fetching pain data", error });
    }
};

const getPainTypes = async (req, res) => {
    try {
        const response = await db.Resource.findAll({
            attributes: ["paintype","id","imglink"],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: "Error fetching pain types", error });
    }
};

module.exports = {
    createPainData,
    getPainData,
    getPainTypes,
};
