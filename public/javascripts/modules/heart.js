import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
    e.preventDefault();
    axios
        .post(this.action)
        .then(res => {
            const isHearted = this.heart.classList.toggle('heart__button--hearted');
            $('.heart-count').textContent = res.data.hearts.length;
            if (isHearted) {
                this.heart.classList.add('heart__button--float');
                setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
            }
        })
        .catch(console.error)
}

export default ajaxHeart;

/**
 * LIKING STUFF ON FACEBOOK
 * 
 * user clicks a button, the button has an event listener
 * that evenbt listener sends an AJAX HTTP POST request (maybe using fetch('www.facebook.com/api/v3/likePost?postId=3213124))
 * Facebook has a controller for HTTP POST request '/api/v3/likePost' where it decodes the auth token for the person liking the post,
 * 
 * 1. Send a notification to the person who made the post that their post was liked
 *   1a. We need the timestamp of the like
 *   1b. The name of the person liking
 * 2. We need to update the Post model with numberOfLikes++
 * 
 */

 /**
  * USER ON FEASTABLE FAVES A RESTAURANT
  * 
  * 
  */