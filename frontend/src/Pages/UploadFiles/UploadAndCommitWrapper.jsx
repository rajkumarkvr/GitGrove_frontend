import React, { useEffect, useState } from "react";
import UploadAndCommit from "./UploadAndCommit";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router-dom";
import getCurrentUser from "../../Contexts/getCurrentUser";

const UploadAndCommitWrapper = () => {
  const { ownername, reponame } = useParams();
  const [branches, setBranches] = useState([]);
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState([]);
  const [created, setCreated] = useState(false);
  const [uploadFail, setUploadFail] = useState(false);
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/service/branches`, {
          ownername: ownername,
          reponame: reponame,
        });

        console.log(response.data.data);
        setBranches(response.data.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const onCancel = () => {
    console.log("cancelled");
  };
  const onCommit = async ({ branch, files, commitMessage }) => {
    console.log(files);
    const formData = new FormData();

    files.forEach((file) => {
      console.log(
        `File name: ${file.name}, size: ${file.size}, type: ${file.type}`
      );
      formData.append("files", file);
    });

    try {
      //   console.log(formData);
      setLoading(true);
      const response = await axiosInstance.post(
        `/service/repository/upload?commitMessage=${encodeURIComponent(
          commitMessage
        )}&branch=${encodeURIComponent(
          branch
        )}&ownerName=${ownername}&reponame=${reponame}&currentUser=${
          currentUser?.username
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCreated(true);
      console.log("Upload successful:", response.data);
    } catch (error) {
      setUploadFail(true);
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <UploadAndCommit
      onCancel={onCancel}
      onCommit={onCommit}
      branches={branches}
      username={ownername}
      reponame={reponame}
      created={created}
      setCreated={setCreated}
      loading={loading}
      uploadFail={uploadFail}
      setUploadFail={setUploadFail}
    />
  );
};

export default UploadAndCommitWrapper;
