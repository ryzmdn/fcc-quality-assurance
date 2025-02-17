"use strict";

const mongoose = require("mongoose");

const Issue = mongoose.model(
  "Issue",
  new mongoose.Schema(
    {
      projectId: { type: "ObjectId", ref: "Project", required: true },
      issue_title: { type: String, required: true },
      issue_text: { type: String, required: true },
      created_by: { type: String, required: true },
      assigned_to: { type: String, default: "" },
      open: { type: Boolean, default: true },
      status_text: { type: String, default: "" },
    },
    {
      timestamps: {
        createdAt: "created_on",
        updatedAt: "updated_on",
      },
    }
  )
);

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    name: { type: String, required: true },
  })
);

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async (req, res) => {
      let project = req.params.project;
      let findProject = await Project.findOne({ name: project }).exec();
      if (!findProject) {
        findProject = await Project.create({
          name: project,
        });
      }
      const issues = await Issue.find({
        projectId: findProject.id,
        ...req.query,
      });

      res.json(issues);
    })

    .post(async (req, res) => {
      let project = req.params.project;
      let findProject = await Project.findOne({ name: project }).exec();
      if (!findProject) {
        findProject = await Project.create({
          name: project,
        });
      }
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      const createdIssue = await Issue.create({
        projectId: findProject._id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      });

      res.json(createdIssue);
    })

    .put(async (req, res) => {
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        open === undefined
      ) {
        res.json({ error: "no update field(s) sent", _id });
        return;
      }
      try {
        const updateFields = {};
        if (issue_title !== undefined) updateFields.issue_title = issue_title;
        if (issue_text !== undefined) updateFields.issue_text = issue_text;
        if (created_by !== undefined) updateFields.created_by = created_by;
        if (assigned_to !== undefined) updateFields.assigned_to = assigned_to;
        if (status_text !== undefined) updateFields.status_text = status_text;
        if (open !== undefined) updateFields.open = open;

        const updatedIssue = await Issue.findByIdAndUpdate(
          _id,
          {
            $set: updateFields,
          },
          { new: true }
        );

        if (!updatedIssue) {
          res.json({ error: "could not update", _id });
          return;
        }

        res.json({ result: "successfully updated", _id });
      } catch (error) {
        console.error(error);
        res.json({ error: "could not update", _id });
      }
    })

    .delete(async (req, res) => {
      let project = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      try {
        const deletedIssue = await Issue.findByIdAndDelete({ _id });
        if (!deletedIssue) {
          res.json({ error: "could not delete", _id: _id });
          return;
        }
        res.json({ result: "successfully deleted", _id: _id });
      } catch (error) {
        console.error(error);
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
