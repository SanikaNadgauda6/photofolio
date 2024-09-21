import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import React, { useContext, useEffect, useState } from "react";
import { db, storage } from "../../firebaseinit";
import { UserContext } from "../../context";
import Modal from "./modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";


const AlbumDetail = ({ album, onBack }) => {
    const { user } = useContext(UserContext);
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                if (!user) return;
                const photosQuerySnapshot = await getDocs(
                    collection(db, "AlbumList", album.id.toString(), "Photos")
                );
        
                // Check if photosQuerySnapshot is actually an array
                if (!photosQuerySnapshot || !photosQuerySnapshot.docs) {
                    console.error("Invalid photosQuerySnapshot:", photosQuerySnapshot);
                    return;
                }

                const photos = [];
                photosQuerySnapshot.forEach((doc) => {
                    photos.push({ id: doc.id, ...doc.data() });
                });

                console.log(photos);
                setPhotos(photos);
            } catch (error) {
                console.log(error);
            }
        }
        fetchPhotos();
    }, [album])

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('No file selected.');
            return;
        }

        const storageRef = ref(storage, `photos/${selectedFile.name}`);
    
        try {
            console.log('Starting upload...');
        
            // Upload file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, selectedFile);
            console.log('File uploaded successfully.');
        
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Download URL retrieved:', downloadURL);
        
            // Save the photo URL and metadata in Firestore
            const newPhotoRef = await addDoc(collection(db, "AlbumList", album.id.toString(), "Photos"), {
                url: downloadURL,
                name: selectedFile.name,
                createdAt: new Date().toISOString(),
            });
            console.log('Photo metadata uploaded to Firestore.');

            // Add the new photo to the photos state
            const newPhoto = {
                id: newPhotoRef.id,
                url: downloadURL,
                name: selectedFile.name,
                createdAt: new Date().toISOString(),
            };

            setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
            setSelectedFile(null);
            alert('Photo uploaded successfully!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Error uploading photo: ' + error.message);
        }
    };
    const handleOpenPhoto = (photo) => {
        const index = photos.findIndex(p => p.id === photo.id);
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
                // Delete photo from Firestore
                await deleteDoc(doc(db, "AlbumList", album.id.toString(), "Photos", selectedPhoto.id));

                // Optionally, also delete from Firebase Storage if needed
                setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== selectedPhoto.id));

                setSelectedPhoto(null);
                alert('Photo deleted successfully!');


            } catch (error) {
                console.error('Error deleting photo:', error);
                alert('Error deleting photo: ' + error.message);
            }
        }
    };
    return (
        <>
            <div className="album-details">
                <FontAwesomeIcon icon={faCircleLeft} onClick={onBack} className="back-to-album"/>
                <h5>Add your photos here: </h5>
                <div className="select-file">
                    <input type="file" onChange={handleFileChange}/>
                </div>
                
                <button onClick={handleUpload} className="upload-photo">Upload Photo</button>
            </div>
            <div className="photo-gallery">
                {photos && photos.length > 0 ? (
                    photos.map((photo) => (
                        <div key={photo.id} className="photo-item" onClick={() => handleOpenPhoto(photo)}>
                            <img src={photo.url} alt={photo.name} className="photo-image" />
                        </div>
                    ))
                ) : (
                        <p>No photos available.</p>
                )}
            </div>
            

            <Modal 
                photo={selectedPhoto} 
                onClose={handleCloseModal} 
                onNext={handleNextPhoto} 
                onPrev={handlePrevPhoto} 
                onDelete={handleDeletePhoto}
            />
        </>
    );
};

export default AlbumDetail;
