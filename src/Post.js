import { Avatar } from '@material-ui/core';
import React, { useState,useEffect } from 'react';
import "./Post.css";
import {db} from './firebase';
import firebase from 'firebase';
 
 
function Post({id,username,caption,imageUrl,user,postId}){
    const [comment,setComment] = useState('');
    const [comments,setComments] = useState('');

    useEffect(() => {
       let unSubscribe;
       if(postId){
           unSubscribe = db
           .collection("posts")
           .doc(postId)
           .collection("comments")
           .orderBy("timestamp","desc")
           .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
           });
       }
       return () => unSubscribe();
    }, [postId]);
    
const postComment = (e) => {
    e.preventDefault();
    // Veritabanında yorumlara gidiyoruz
    db.collection("posts")
    .doc(postId).collection("comments")
    // comments'lere ekleme yapıyoruz
    .add({
        text:comment,
        username:user.displayName,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
}

    return (
        <div className="post" key={id} >
            <div className="post-header">
             <Avatar 
             className="post-avatar" 
             alt={username}
             src="./SSS.jpg"/>
             <h3>{username}</h3>
            </div>
            <img src={imageUrl} alt="aa" className="post-image" />
            <h4 className="post-text"><strong>{username}</strong> {caption}</h4>
            <h5 className="commentsler">Comments</h5>
            {
                  comments.length > 0 ? 
                  comments.map((comment) => (
                    <div className="post-comments">
                 
                    <p>
                        <strong>{comment.username}</strong>: {comment.text}
                    </p>
                    </div>
                )) : (null)
            }
             
            {
                // user varsa
                user && (
                    <form  className="post-commentForm">
                            <input 
                            className="post-input"
                            placeholder="Yorum yap"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            type="text" />       
                            <button disabled={!comment} className="post-button" type="submit" onClick={postComment}>Gönder</button>
                    </form>
                )  
            }

        </div>
    )
}

export default Post;