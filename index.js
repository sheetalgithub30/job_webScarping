import axios from "axios";
import * as cheerio from "cheerio";
import xlsx from "xlsx";

const url =
  "https://www.freshersworld.com/jobs/category/it-software-job-vacancies";

async function jobScrapping() {
  try {
    const response = await axios.get(url);
    const data = [];
    const $ = cheerio.load(response.data);

    $("p").each((index, elem) => {
      const para = $(elem).text();
      data.push(para);
    });
    $(".wrap-title.seo_title").each((index, tag) => {
      data[index] = {};
      data[index].title = $(tag).text();
    });
    $(".latest-jobs-title.font-16.margin-none.inline-block.company-name").each(
      (index, tag) => {
        data[index].company_name = $(tag).text();
      }
    );

    $(".job-location.display-block.modal-open.job-details-span").each(
      (index, tag) => {
        data[index].job_location = $(tag).text();
      }
    );

    $(".ago-text").each((index, tag) => {
      data[index].posted = $(tag).text();
    });

    $(".desc").each((index, tag) => {
      data[index].description = $(tag).text();
    });

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    xlsx.writeFile(workbook, "data2.xlsx");
    console.log("Data saved to data.xlsx");
  } catch (error) {
    console.log(error);
  }
}
jobScrapping();
