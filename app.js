const express = require('express');
const serverapp = express();
const cors = require('cors');
const path = require('path');
const axios = require('axios');

serverapp.use(cors({
  'origin': '*',
}))


serverapp.use(express.static(path.join(__dirname, './public')));

serverapp.get('/search', async function (req, res) {
  const query = req.query.q;

  
  const repos = [
    {
      url: `https://arxiv.org/search/?query=${query}&searchtype=all&source=header`,
      title: "arXiv",
    },
    {
      url: `https://www.biorxiv.org/search/${query}`,
      title: "bioRxiv",
    },
    {
      url: `https://www.medrxiv.org/search/${query}`,
      title: "medRxiv",
    },
    {
      url: `https://www.ncbi.nlm.nih.gov/pmc/?term=${query}`,
      title: "NCBI PMC",
    },
    {
      url: `https://scholar.google.com/scholar?q=${query}+filetype:pdf`,
      title: 'PDF Search'
    }

  ];

  try {
    const responseData = await Promise.all(repos.map(repo => axios.get(repo.url)));
  
    const dataArray = responseData.map(response => {
      let data = response.data;
      // Replace the question mark character with the appropriate encoding
      data = data.replace(/�/g, 'è'); // Replace with the desired character
  
      return data;
    });
  
    const htmlData = dataArray.join(''); // Combine all the processed data into a single HTML string
  
    res.setHeader('Content-Type', 'text/html'); // Set the content type as HTML
    res.send(htmlData); // Send the HTML response
  } catch (error) {
    console.log('Error while fetching', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
  
});


const port = 3000;
serverapp.listen(port, function () {
  console.log(`Server: ${port}`);
});
