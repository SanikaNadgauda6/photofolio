import React, { useEffect, useState } from "react";
import "./album.css";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, setDoc, collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebaseinit";
import { useContext } from "react";
import { UserContext } from "../../context";
import AlbumDetail from "./albumDetail";
const AlbumForm = () => {

    const { user } = useContext(UserContext);

    const [currentView, setCurrentView] = useState('list');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumName, setAlbumName] = useState();
    const [albumList, setAlbumList] = useState([]);

    useEffect(() => {
           const fetchAlbums = async () => {
               try {
                   console.log("AlbumsList mounted");
                   if (!user) return;
                   const querySnapshot = await getDocs((collection(db, "AlbumList")));
                   const albums = [];
                   querySnapshot.forEach((doc) => {
                       albums.push({ id: doc.id, ...doc.data() });
                    //    console.log(doc.id, " => ", doc.data());
                   });
                   setAlbumList(albums);
               } catch (error) {
                   console.error("Error fetching documents: ", error);
               }
        };
        fetchAlbums();
    }, [user]);

    const handleAddAlbum = async (e) => {
        try {
            e.preventDefault();
            if (!user) {
                console.log("login!!");
                return;
            }
        if (!albumName) {
            alert("Album name not specified.");
            return;
        }
        const newAlbum = {
            id: Date.now(),
            name: albumName,
            createdAt: new Date().toISOString()
        };
            setAlbumList([newAlbum, ...albumList]);
                        
            await setDoc(doc(db, "AlbumList", albumName), newAlbum);

            setAlbumName(' ');
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleAlbumOpen = (album) => {
        setSelectedAlbum(album);
        setCurrentView('album');
    };
    
    return (
        <>
            {currentView === 'list' ? (
                <>
                    <div className="album-form">
                        <input type="text" name="album-name" placeholder="Enter your album name" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
                        <button onClick={handleAddAlbum} className="add-album"> Add Album</button>
                    </div>
                    <div className="album-list">
                        {albumList.map((album) => (
                            <span key={album.id} onDoubleClick={() => handleAlbumOpen(album)}>
                                <FontAwesomeIcon icon={faFolder} className="folder-icon" />
                                <br />
                                {album.name}
                            </span>
                        ))}
                    </div>
                </>
            ) : (
                    <AlbumDetail album={selectedAlbum} onBack={() => setCurrentView('list')} />
            )}
        </>
        
    );
};

export default AlbumForm;