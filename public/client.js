
document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();


  const searchInput = document.querySelector('input[name="term"]');
  const searchResults = document.getElementById("search-results");
  const query = searchInput.value.trim();

  if (query === "") {
    return;
  }

  searchResults.innerHTML = ""; // Clear previous search results

  const repos = [

    {
      title: "arXiv",
    },
    {
      title: "bioRxiv",
    },
    {
      title: "medRxiv",
    },
    {
      title: "NCBI PMC",
    },
    {
      title: "PDF Search",
    },

  ];

  for (const repo of repos) {
    const repoDiv = document.createElement("div");
    repoDiv.className = "repository";
    repoDiv.innerHTML = `<h3>${repo.title}</h3>`;
    searchResults.appendChild(repoDiv);

    try {
      const response = await fetch(`/search?q=${query}`);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      //======================================================================================= Arxiv Search================================================================

      if (repo.title === "arXiv") {
        const paperItems = doc.querySelectorAll('.arxiv-result');
        const topPaperItems = Array.from(paperItems).slice(0, 2);

        if (topPaperItems.length === 0) {
          repoDiv.innerHTML += "<p>No results found.</p>";

        } else {
          topPaperItems.forEach((paperItem) => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";
            const arxiv = Array.from(paperItem.querySelectorAll('.list-title')).map((arxiv) => arxiv.innerHTML);
            const titleName = Array.from(paperItem.querySelectorAll('.title')).map((title) => title.innerHTML).join(" ");
            const authors = Array.from(paperItem.querySelectorAll('.authors')).map((author) => author.textContent);
            const abstract = Array.from(paperItem.querySelectorAll('.abstract')).map((abstract) => abstract.innerHTML);
            const footer = Array.from(paperItem.querySelectorAll('.is-size-7')).map((footer) => footer.innerHTML);

            const links = paperItem.querySelector('a');
            const articleLinks = Array.from(links).map((link) => {
              const href = link.getAttribute("href");
              const url = "https://arxiv.org" + href;
              return `<a href="${url}">${link.textContent}</a>`;
            });

            // directing to the desired page
            const href = paperItem.querySelector("a").getAttribute('href');
            const titleLink = document.createElement("a");
            titleLink.setAttribute("href", "https://arxiv.org" + href);

            // Highlight exact title match
            if (titleLink.textContent.toLowerCase() === query.toLowerCase()) {
              paperDiv.innerHTML = `<h4><mark>${titleLink.outerHTML}</mark></h4>`;
            } else {
              paperDiv.innerHTML = `<h4>${titleLink.outerHTML}</h4>`;
            }

            paperDiv.innerHTML += `
            <p>${arxiv}</p>
            <h4>${titleName}</h4>
            <p>${authors}</p>
            <p>${abstract}</p> <br>
            <p>${footer}</p>

            <p class="article">${articleLinks.join(" ")}</p>
          `;

            repoDiv.appendChild(paperDiv);

          });
        }

      }

      //========================================================================================  NCBI PMC =============================================================

      if (repo.title === "NCBI PMC") {
        const paperItems = doc.querySelectorAll(".rprt");
        const topPaperItems = Array.from(paperItems).slice(0, 2);

        if (topPaperItems.length === 0) {
          repoDiv.innerHTML += "<p>No results found.</p>";
        } else {
          topPaperItems.forEach((paperItem) => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";
            const authors = Array.from(paperItem.querySelectorAll(".supp")).map(
              (author) => author.innerText
            );

            const links = paperItem.querySelector(".links").querySelectorAll("a");
            const articleLinks = Array.from(links).map(link => {
              const href = link.getAttribute("href");
              const url = "https://www.ncbi.nlm.nih.gov" + href;
              return `<a href="${url}">${link.textContent}</a>`;
            });

            // directing to the desired page

            const href = paperItem.querySelector("a").getAttribute('href');
            const titleLink = document.createElement("a");
            titleLink.setAttribute("href", "https://www.ncbi.nlm.nih.gov" + href);
            titleLink.textContent = paperItem.querySelector(".title").textContent;

            // Highlight exact title match
            if (titleLink.textContent.toLowerCase() === query.toLowerCase()) {
              paperDiv.innerHTML = `<h4><mark>${titleLink.outerHTML}</mark></h4>`;
            } else {
              paperDiv.innerHTML = `<h4>${titleLink.outerHTML}</h4>`;
            }

            paperDiv.innerHTML += `
            <p>Author(s): ${authors.join(", ")}</p>
            <p class="article">${articleLinks.join(" ")}</p>
          `;

            repoDiv.appendChild(paperDiv);

          });

        }
      }

      //========================================================================================  For bioRxiv =============================================================
      if (repo.title === "bioRxiv") {
        const paperItems = doc.querySelectorAll(".search-result-highwire-citation");
        const topPaperItems = Array.from(paperItems).slice(0, 4);

        if (topPaperItems.length === 0) {
          repoDiv.innerHTML += "<p>No results found.</p>";
        } else {
          topPaperItems.forEach((paperItem) => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";
            // const title = paperItem.querySelector(".highwire-cite-title").innerHTML;
            const authors = Array.from(
              paperItem.querySelectorAll(
                ".highwire-citation-authors .highwire-citation-author"
              )
            ).map((author) => author.innerText);
            const summary = paperItem.querySelector(
              ".highwire-cite-metadata"
            ).innerText;


            // directing to the desired page
            const href = paperItem.querySelector("a").getAttribute("href");
            const titleLink = document.createElement("a");
            titleLink.setAttribute("href", "https://www.biorxiv.org/search" + href);
            titleLink.textContent = paperItem.querySelector(".highwire-cite-title").textContent;


            // Highlight exact title match
            if (titleLink.textContent.toLowerCase() === query.toLowerCase()) {
              paperDiv.innerHTML = `<h4><mark>${titleLink.outerHTML}</mark></h4>`;
            } else {
              paperDiv.innerHTML = `<h4>${titleLink.outerHTML}</h4>`;
            }
            paperDiv.innerHTML += `
        <p>Author(s): ${authors.join(", ")}</p>
        <p>${summary}</p>
      `;
            repoDiv.appendChild(paperDiv);
          });
        }

      }

      //=============================================================================== medRxiv =============================================================
      if (repo.title === "medRxiv") {
        const paperItems = doc.querySelectorAll(".result-jcode-medrxiv");
        const topPaperItems = Array.from(paperItems).slice(0, 4);

        if (topPaperItems.length === 0) {
          repoDiv.innerHTML += "<p>No results found.</p>";
        } else {
          topPaperItems.forEach((paperItem) => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";

            // const title = paperItem.querySelector(".highwire-cite-title").innerHTML;
            const authors = Array.from(
              paperItem.querySelectorAll(".highwire-citation-authors .highwire-citation-author")
            ).map((author) => author.innerText);
            const summary = paperItem.querySelector(".highwire-cite-metadata").innerText;


            // directing to the desired page
            const href = paperItem.querySelector("a").getAttribute("href");
            const titleLink = document.createElement("a");
            titleLink.setAttribute("href", "https://www.medrxiv.org/search" + href);
            titleLink.textContent = paperItem.querySelector(".highwire-cite-title").textContent;

            // Highlight exact title match
            if (titleLink.textContent.toLowerCase() === query.toLowerCase()) {
              paperDiv.innerHTML = `<h4><mark>${titleLink.outerHTML}</mark></h4>`;
            } else {
              paperDiv.innerHTML = `<h4>${titleLink.outerHTML}</h4>`;
            }

            paperDiv.innerHTML += `
            <p>Author(s): ${authors.join(", ")}</p>
            <p>${summary}</p>
          `;
            repoDiv.appendChild(paperDiv);
          });
        }
      }

      //=============================================================================== pdf search ==================================================================


      if (repo.title === "PDF Search") {
        const paperItems = doc.querySelectorAll(".gs_ri");
        const topPaperItems = Array.from(paperItems).slice(0, 4);

        if (topPaperItems.length === 0) {
          repoDiv.innerHTML += "<p>No results found.</p>";
        } else {
          topPaperItems.forEach((paperItem) => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";
            const titleLink = paperItem.querySelector("a");
            const title = titleLink.innerHTML;
            const url = titleLink.href;
            const summary = paperItem.querySelector(".gs_rs");
            const summaryString = summary ? summary.textContent : "";
            const authorMatch = summaryString.match(/- .*? -/);
            const authors = authorMatch ? authorMatch[0].replace(/- /, "") : "";

            const auth = paperItem.querySelectorAll(".gs_a")[0].textContent;

            // Highlight exact title match
            const titleMarkup = title.toLowerCase() === query.toLowerCase() ? `<mark>${title}</mark>` : title;



            paperDiv.innerHTML = `
            <h4>${titleMarkup}</h4>
            <p>Author(s): ${auth}</p>
            <p>${summaryString}</p>
            
            <a href="${url}" target="_blank" rel="noopener">Download PDF</a>
          `;
          repoDiv.appendChild(paperDiv);
          });
        }
      }


    } catch (error) {
      console.error(`Error fetching data from ${repo.title}:`, error);
      repoDiv.innerHTML += "<p>An error occurred while fetching the data.</p>";
    }
  }
});