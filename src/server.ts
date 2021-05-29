import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", (req, res) => {
    const { image_url } = req.query;

    if (!image_url) {
      return res.status(401).send("You must provide an URL");
    }

    return filterImageFromURL(image_url)
      .then((serviceRes) => {
        res.sendFile(serviceRes, (err) => {
          if (err) {
            console.log("error sending file: ", err);
          } else {
            deleteLocalFiles([serviceRes]);
          }
        });
      })
      .catch((err) => {
        console.log("error filtering img: ", err);
      });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
