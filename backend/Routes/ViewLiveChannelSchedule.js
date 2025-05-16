const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
router.get('/schedule', async (req, res) => {
  try {
    const response = await axios.get('https://www.swayamprabha.gov.in/program/current_he/5');
    const html = response.data;

    const $ = cheerio.load(html);

    const schedule = [];

    // Adjust the selectors based on the actual structure of the Swayam Prabha page
    $('table tbody tr').each((index, element) => {
      const cells = $(element).find('td');
      const time = $(cells[0]).text().trim();
      const subject = $(cells[1]).text().trim();
      const course = $(cells[2]).text().trim();
      if (time && subject && course) {
        schedule.push({ time, subject, course });
      }
    });

    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

module.exports = router;
