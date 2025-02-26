import React, { useEffect, useState } from "react";
import ReviewAndMerge from "./ReviewAndMerge";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router-dom";
import getCurrentUser from "../../Contexts/getCurrentUser";

export const ReviewAndMergeWrapper = () => {
  const [comments, setComments] = useState([]);
  const [commentadded, setCommentAdded] = useState(false);
  const [merged, setMerged] = useState(false);
  const oldCode = 'console.log("Hello, World!");';
  const newCode = 'console.log("Hello, Universe!");';
  const [selectedResolution, setSelectedResolution] = useState("");
  const currentUser = getCurrentUser();
  const {
    id,
    username,
    reponame,
    title,
    creatorname,
    sourceBranch,
    targetBranch,
  } = useParams();

  const handleAddComment = async (comment) => {
    console.log(comment);

    try {
      const response = await axiosInstance.post(
        `/service/pull-request/add-comment`,
        {
          PRId: id,
          content: comment.text,
          currentUsername: currentUser.username,
        }
      );
      setCommentAdded((prev) => !prev);
      console.log(response.data);
      // setComments([...comments, response.data.data]);
    } catch (err) {
      console.error(err);
      return;
    }
  };
  //   [
  //   {
  //     "postedAt": "2025-02-24T17:54:03",
  //     "userAvatar": "https://res.cloudinary.com/dye2p5i78/image/upload/v1739177430/defaul_profile_treuuc.jpg",
  //     "content": "rajkumar",
  //     "username": "first comment"
  //   }
  // ]
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/service/pull-request/comments?PR-Id=${id}`
      );
      // console.log(response.data.comments);
      const data = response.data.comments;
      if (!sessionStorage.getItem("comment_count")) {
        setComments(data);
        sessionStorage.setItem("comment_count", data.length);
      } else if (sessionStorage.getItem("comment_count") != data.length) {
        setComments(data);
        sessionStorage.setItem("comment_count", data.length);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [commentadded]);

  useEffect(() => {
    const clearInter = setInterval(fetchComments, 1000);
    return () => clearInterval(clearInter);
  }, []);
  const handleResolveComment = (index) => {
    console.log("caled");
    const updatedComments = comments.map((c, i) =>
      i === index ? { ...c, resolved: true } : c
    );
    // setComments(updatedComments);
  };

  const handleMerge = async () => {
    try {
      const response = await axiosInstance.post(
        `/service/pull-request/merge?id=${id}&username=${currentUser.username}&strategy=${selectedResolution}`
      );
      console.log(response.data);
      setMerged(true);
    } catch (err) {
      console.error(err);
      setMerged(false);
      return;
    }

    console.log("Changes merged!");
  };

  return (
    <ReviewAndMerge
      oldCode={oldCode}
      newCode={newCode}
      comments={comments}
      onAddComment={handleAddComment}
      onResolveComment={handleResolveComment}
      onMerge={handleMerge}
      title={title}
      creatorname={creatorname}
      sourceBranch={sourceBranch}
      targetBranch={targetBranch}
      reponame={reponame}
      prid={id}
      merged={merged}
      setMerged={setMerged}
      setSelectedResolution={setSelectedResolution}
      selectedResolution={selectedResolution}
    />
  );
};
