import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { db, storage } from "../../firebaseinit";
import { UserContext } from "../../context";
import Modal from "./modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const AlbumDetail = ({ album, onBack }) => {
  const { user } = useContext(UserContext);

  // Updated to hold multiple selected files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        if (!user) return;
        const photosQuerySnapshot = await getDocs(
          collection(db, "AlbumList", album.id.toString(), "Photos")
        );

        const photos = [];
        photosQuerySnapshot.forEach((doc) => {
          photos.push({ id: doc.id, ...doc.data() });
        });

        setPhotos(photos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhotos();
  }, [album, user]);

  // Handle multiple file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Storing all selected files
  };

  // Updated to handle the upload of multiple files
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("No files selected.");
      return;
    }

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const storageRef = ref(storage, `photos/${file.name}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const newPhotoRef = await addDoc(
          collection(db, "AlbumList", album.id.toString(), "Photos"),
          {
            url: downloadURL,
            name: file.name,
            createdAt: new Date().toISOString(),
          }
        );

        return {
          id: newPhotoRef.id,
          url: downloadURL,
          name: file.name,
          createdAt: new Date().toISOString(),
        };
      });

      console.log("photo-uploaded", photos);
      const newPhotos = await Promise.all(uploadPromises);
      setPhotos((prevPhotos) => [...newPhotos, ...prevPhotos]);
      setSelectedFiles([]); // Clear after upload

      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Error uploading photos: " + error.message);
    }
  };

  const handleOpenPhoto = (photo) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    const prevPhoto = index > 0 ? photos[index - 1] : null;
    const nextPhoto = index < photos.length - 1 ? photos[index + 1] : null;
    setSelectedPhoto({ ...photo, prev: prevPhoto, next: nextPhoto });
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    if (selectedPhoto && selectedPhoto.next) {
      handleOpenPhoto(selectedPhoto.next);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhoto && selectedPhoto.prev) {
      handleOpenPhoto(selectedPhoto.prev);
    }
  };

  const handleDeletePhoto = async () => {
    if (selectedPhoto) {
      try {
        await deleteDoc(
          doc(db, "AlbumList", album.id.toString(), "Photos", selectedPhoto.id)
        );
        setPhotos((prevPhotos) =>
          prevPhotos.filter((photo) => photo.id !== selectedPhoto.id)
        );
        setSelectedPhoto(null);
        alert("Photo deleted successfully!");
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert("Error deleting photo: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="album-details">
        <FontAwesomeIcon
          icon={faCircleLeft}
          onClick={onBack}
          className="back-to-album"
        />
        <h5>Add your photos here: </h5>
        <div className="select-file">
          {/* Allow multiple files to be selected */}
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload} className="upload-photo">
          Upload Photo
        </button>
      </div>

      <div className="photo-gallery">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div
              key={photo.id}
              className="photo-item"
              onClick={() => handleOpenPhoto(photo)}>
              <img src={photo.url} alt={photo.name} className="photo-image" />
              <h3>
                Name: {photo.name}, Time: {photo.createdAt}{" "}
              </h3>
            </div>
          ))
        ) : (
          <p>No photos available.</p>
        )}
      </div>

      {selectedPhoto && (
        <Modal
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          onDelete={handleDeletePhoto}
        />
      )}
    </>
  );
};

export default AlbumDetail;
