const express = require('express');
const router = express.Router();
const BanList = require('../../models/banList');
const UcubeList = require('../../models/ucubeList');

router.get('/', async (req, res) => {
  const banUsers = await BanList.find();
  const ucubeUsers = await UcubeList.find();
  res.render('panel', { banUsers, ucubeUsers });
});

router.post('/ban/add', async (req, res) => {
  const { userId } = req.body;
  if (userId) await BanList.create({ userId });
  res.redirect('/panel');
});

router.post('/ban/remove', async (req, res) => {
  const { userId } = req.body;
  await BanList.deleteOne({ userId });
  res.redirect('/panel');
});

router.post('/ucube/add', async (req, res) => {
  const { userId } = req.body;
  if (userId) await UcubeList.create({ userId });
  res.redirect('/panel');
});

router.post('/ucube/remove', async (req, res) => {
  const { userId } = req.body;
  await UcubeList.deleteOne({ userId });
  res.redirect('/panel');
});

module.exports = router;
