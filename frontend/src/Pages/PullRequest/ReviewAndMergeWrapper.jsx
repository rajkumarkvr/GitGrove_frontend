import React, { useState } from "react";
import ReviewAndMerge from "./ReviewAndMerge";

export const ReviewAndMergeWrapper = () => {
  const [comments, setComments] = useState([]);
  const oldCode = 'console.log("Hello, World!");';
  const newCode = 'console.log("Hello, Universe!");';

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  const handleResolveComment = (index) => {
    const updatedComments = comments.map((c, i) =>
      i === index ? { ...c, resolved: true } : c
    );
    setComments(updatedComments);
  };

  const handleMerge = () => {
    console.log("Changes merged!");
    // Add your merge logic here
  };

  return (
    <ReviewAndMerge
      oldCode={oldCode}
      newCode={newCode}
      comments={comments}
      onAddComment={handleAddComment}
      onResolveComment={handleResolveComment}
      onMerge={handleMerge}
    />
  );
};
