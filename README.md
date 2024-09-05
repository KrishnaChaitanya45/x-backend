
# LMS ( Learning Management System )




I’ve been building an LMS platform with multiple features like group learning, live collaborative coding etc. I’ve started working on this project to learn and explore the microservice architecture and also understand the limitations of the monolithic architecture. The diagram below ( which I've drawn using excalidraw, I know it's hard to digest that it's a system design, it doesn’t look like one ). I wanted a diagram to visualize the microservice and the architecture for the LMS platform as a whole. 


## Architecture: - 

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcPRihxasuae2fYQAqh68lx4Szw_p2dKEJkG3wlaUz3T-INm2ThvJupYleozcH7s7gj6pt05VhBqJ0jXSih28NEsZOw4Bngri2IgySzpmnSniWpjz8gIZmr5UkT5ecFdtKU8i-jAttfYeMQhNY72zlyRgf4?key=dmrkCI5Z_eyozGskyDezRQ)




These are the following features that I've planned to incorporate into the LMS platform: - 

* Typical LMS platform features where the teacher can upload the courses and users can buy them to watch those.

*  Communities for different skill sets, group leaderboard. 

* Users can form groups and learn together.

* There would be group wars, where communities would be competing with others by solving some questions every weekend. 

* There would be a group learning feature, where a bunch of users can watch a course together and discuss it amongst themselves ( except for making fun of the instructor ).

* Users can work on a project together using our own IDE, where we allow users to work collaboratively, ( instead of fighting over the merge issues, lack of communication is a serious issue ).

* There would be a dashboard for both the teachers, users and community admins to monitor and analyze the progress and I’m also planning to integrate machine learning moving forward ( once I successfully get out of procrastination ).

* I’m also planning to add in-app currencies where users could start learning a course for free and earn the currency in the app by participating in various contests, joining communities etc. He could utilize the currency to customize his profile and buy courses.


## Microservice Planning: - 

That’s a lot of planning, ( even though it's not, but let's look into the microservices )

I’ve divided this architecture into multiple microservices such as: - 

**a ) Authentication Microservice: -**  This microservice would be used to authenticate the user using Refresh token rotation, and storing the tokens and user details in the PostgreSQL database. For the teachers, the admin would need to look into their education qualifications and work experience and verify the teacher. We’ll discuss more about this microservice later in its specific section. 

**b ) Video Processing Microservice: -**  This microservice would be responsible for both processing the video and uploading the video to the cloud services. For now, I’m using Cloudinary for Object Storage and FFMPEG for processing the videos. More on this later in the video processing Microservice section. 

**c ) Chatting Microservice: -**  Pretty straightforward I guess, it's used for real-time communication using WebSockets. In the application, it's used for group chats within the community and also one-to-one chats between friends. I want to scale the web sockets and I’m exploring multiple ways to do so. More on this later.

**d ) Notifications Microservice: -**  Notifications, as this will be a website ( hopefully ), I'm planning to implement in-app notifications or notifications inside the website, just like how LinkedIn or other web applications do it. That would be easier and better for a website. 

**e ) Payments Microservice: -  🤑** Payments 🤑, for every course, the teacher gets to set the price for the course using the in-app currency and students would be initially given some tokens to buy a course for free and then if he wants more, he can buy them using our payments system.

**f ) Courses and Communities Microservice: -**  This microservice is responsible for maintaining the user roles in the community, creating and managing the communities, teachers can create their courses using this microservice, basically this microservice is used for CRUD operations for both courses and communities. 

 


## Build So Far:-

I’ve built a video processing microservice:- 





### Backend Functionalities :- 

- Takes a video as input from the user, now the format for the video can be anything, and the size for the video is restricted to less than 500mb. ( I’ll get back on this )

- Convert the video in to a single format, i’m using mp4 for now.

- Creates a new job and adds it to the bullMQ queue, it creates a unique id to the user which can be used to track its progress

- The video processing takes a lot of time so we’ll be processing it asynchronously, so the worker spins up  a new docker container for 2-3 video upload jobs.

- This docker container is responsible to run an FFMPEG script which converts the video and creates a HLS playlist.

- For object storage, I'm using Cloudinary. So the raw videos and the processed videos are stored in two separate directories, 

- The output for the HLS playlist is streamed to the Cloudinary, to save the memory. 

- Mean while the progress is updated constantly in the redis store, so use can see the progress by short polling by using the key ( videoID)

- Once the video is uploaded, the docker container automatically destroys it and the job is removed from the queue.

- User gets a new link which maps to the [playlist.m3u8](https://res.cloudinary.com/ddnov4rnh/raw/upload/v1711116641/hls-playlists/TestVideoTwo1711116605439/playlist.m3u8) file 




#### Architecture: - 

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfPRsyABO_5IeTcP8LWpJx4YL_X5PBmdKJ4PM5OcduDK4WTFSvxlcer3odi-yWn_6oCDGhx4btGss9PrGOUk_Ro-zJJaezmhpkXk9VJJcph-3sdf9T_L1ooWiOpegh3cJ1P1MgSS5mh3Dxw2G8RXa8k3lc?key=dmrkCI5Z_eyozGskyDezRQ)

- The watermark step is not included for now.




_Adding all the screenshots and explanation is not quite helping me out to explain, so i added a video to demonstrate hot it works_

[Demonstration Video](https://www.loom.com/share/1da89469ec7a42ed97908cb277cb5788?sid=03bd7c44-602e-4609-8374-02395467f364) 


### Front End Functionalities:- 

- Once the url is obtained, in frontend we have a video player created, using Next JS, hls.js

- We can use this URL to stream the video, we get options to speed up, mute  and unmute ( the general options for the video player )

- And Along with those options we get **Bitrate streaming,** based on the internet speed the best possible resolution would be determined and played

- The HLS playlist that we have contains, 1080p.ts. 720p.ts, 480p.ts and 360p.ts files

- Depending on the length of the video it can also have parts like 1080p\_1.ts, 1080\_2.ts etc.

- User can also manually choose a resolution and play the file using that resolution, 



_Screenshots and explanations didn’t seem to explain the system well enough_

[Demonstration Video](https://www.loom.com/share/4b1b1a07b9b54973ab34263ffa9e34d1)



#### Future Plans
As mentioned in the video, later i’ve done a bit of research on how the video processing is implemented efficiently and found a way to do so. I’ll try to update the architecture with this one in the future to handle more video processing jobs.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcY1ceepaF8YtOQ_FErbeS2lZ_a7CvBBSeqeE7K3MdbRpVfRtEp7y5QzHsBh6R6X7pWO7YyqsbW7yNzItTayyHATOyDm2Ef3fbAy0Zhfa9TtDUMIzxQ67wxumdcLJcpCOKKdAfsm-AuAdM3JjVElr2zPVJn?key=dmrkCI5Z_eyozGskyDezRQ)

And for the frontend side, I’m planning to add a new feature, which allows multiple users to stream the video over a call at once, they can have a discussion, control the video together and as this is an LMS platform, they get to learn together. 


**I know I’ve misunderstood a lot of concepts, and I’m constantly exploring how they are done and updating the project. Join me on the adventure, and let’s make new mistakes together 🚀!**


