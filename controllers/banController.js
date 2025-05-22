const BanList = require('../models/banList');

exports.getAll = async (req, res) => {
    const data = await BanList.findAll();
    res.json(data);
};

exports.add = async (req, res) => {
    const { userId } = req.body;
    await BanList.create({ userId });
    res.json({ success: true });
};

exports.remove = async (req, res) => {
    const { userId } = req.params;
    await BanList.destroy({ where: { userId } });
    res.json({ success: true });
};
