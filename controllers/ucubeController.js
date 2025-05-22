const UcubeList = require('../models/ucubeList');

exports.getAll = async (req, res) => {
    const data = await UcubeList.findAll();
    res.json(data);
};

exports.add = async (req, res) => {
    const { userId } = req.body;
    await UcubeList.create({ userId });
    res.json({ success: true });
};

exports.remove = async (req, res) => {
    const { userId } = req.params;
    await UcubeList.destroy({ where: { userId } });
    res.json({ success: true });
};
