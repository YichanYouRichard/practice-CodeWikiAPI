const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all the datas!");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleId").get(function (req, res) {
  const articleId = req.params.articleId;
  Article.findOne({ _id: articleId }, function (err, foundArticle) {
    if (!err) {
      res.send(foundArticle);
    } else {
      res.send(err);
    }
  });
});

app.get("/articles/:articleId");

app.get("/", function (req, res) {
  res.send("Hello World! Server has created!");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
