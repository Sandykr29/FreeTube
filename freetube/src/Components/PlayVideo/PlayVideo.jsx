import React, { useEffect, useState } from 'react';
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

export const PlayVideo = () => {
    const { videoId } = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async () => {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url)
            .then(res => res.json())
            .then(data => {
                setApiData(data.items[0]);
                fetchChannelData(data.items[0].snippet.channelId);
            })
            .catch(error => console.error('Error fetching video data: ', error));
    }

    const fetchChannelData = async (channelId) => {
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
        await fetch(channelData_url)
            .then(res => res.json())
            .then(data => setChannelData(data.items[0]))
            .catch(error => console.error('Error fetching channel data: ', error));
    }

    const fetchCommentData = async () => {
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
        await fetch(comment_url)
            .then(res => res.json())
            .then(data => setCommentData(data.items))
            .catch(error => console.error('Error fetching comment data: ', error));
    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        fetchCommentData();
    }, [apiData]);

    return (
        <div className='play-video'>
            {apiData && (
                <iframe 
                    title="YouTube Video" 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                ></iframe>
            )}
            {apiData && (
                <h3>{apiData.snippet.title}</h3>
            )}
            {apiData && (
                <p>{value_converter(apiData.statistics.viewCount)} Views &bull; {moment(apiData.snippet.publishedAt).fromNow()}</p>
            )}
            <div className='play-video-info'>
                {/* Render other info */}
            </div>
            <hr />
            <div className="publisher">
                {channelData && channelData.snippet && channelData.snippet.thumbnails && (
                    <img src={channelData.snippet.thumbnails.default.url} alt="" />
                )}
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                {apiData && (
                    <p>{apiData.snippet.description.slice(0, 250)}</p>
                )}
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
                {commentData.map((item, index) => (
                    <div key={index} className='comment'>
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>
                                {item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span>
                            </h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-action">
                                <img src={like} alt="" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}











// import React, { useEffect, useState } from 'react'
// import "./PlayVideo.css";
// import video1 from "../../assets/video.mp4"
// import like from "../../assets/like.png";
// import dislike from "../../assets/dislike.png"
// import share from "../../assets/share.png"
// import save from "../../assets/save.png"
// import jack from "../../assets/jack.png"
// import user_profile from "../../assets/user_profile.jpg"
// import { API_KEY, value_converter } from '../../data';
// import moment from 'moment';
// import { useParams } from 'react-router-dom';

// export const PlayVideo = () => {
//     const {videoId}=useParams();

//     const [apiData,setApiData]=useState(null)
//     const [channelData,setChannelData]=useState(null);
//     const [commentData,setCommentData]=useState([]);

//     const fetchVideoData=async()=>{
//         const videoDetails_url=`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
//         await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0]))
//     }

//  const fetchOtherData=async()=>{
//     const channelData_url=`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;

//     await fetch(channelData_url).then((res)=>res.json()).then((data)=>setChannelData(data.items[0]));

//     const comment_url=`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`

//     await fetch(comment_url).then((res)=>res.json()).then((data)=>setCommentData(data.items))

//  }

 

 

// useEffect(()=>{
//     fetchVideoData()
// },[videoId])

// useEffect(()=>{
//     fetchOtherData()
// },[apiData])

//   return (
//     <div className='play-video'>
//         {/* <video src={video1} controls autoPlay muted/> */}
//         <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
//         <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
//         <p>{apiData?value_converter(apiData.statistics.viewCount):"16K"} Views &bull; {apiData?moment(apiData.snippet.publishedAt).fromNow():""} </p>
//         <div className='play-video-info'>
//             <p>1525 Views &bull; 2 days ago</p>
//             <div>
//             <span><img src={like} alt="" />125</span>
//             <span><img src={dislike} alt="" />2</span>
//             <span><img src={share} alt="" />Share</span>
//             <span><img src={save} alt="" />Save</span>
//             </div>
//         </div>
//         <hr />
//         <div className="publisher">
//             <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
//             <div>
//                 <p>{apiData?apiData.snippet.channelTitle:""}</p>
//                 <span>{channelData?value_converter(channelData.statistics.subscriberCount):"1M"} Subscribers</span>
//             </div>
//             <button>Subscribe</button>
//         </div>
//         <div className="vid-description">
//             <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
//             <hr />
//             <h4>{apiData?value_converter(apiData.statistics.commentCount):102} Comments</h4>

// {commentData.map((item,index)=>{
//     return(
//         <div key={index} className='comment'>
//         <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
//         <div>
//             <h3>
//                 {item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span>
//             </h3>
//             <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
//             <div className="comment-action">
//                 <img src={like} alt="" />
//                 <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
//                 <img src={dislike} alt="" />
//             </div>
//         </div>
//     </div>
//     )
// })}

                 
//         </div>
//     </div>
//   )
// }
