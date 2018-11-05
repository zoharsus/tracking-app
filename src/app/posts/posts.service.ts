import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              seller: post.seller,
              tracking: post.tracking,
              origin: post.origin,
              destination: post.destination,
              status: post.status,
              expectedDate: post.expectedDate,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
    });
  });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(tracking: string) {
    return this.http.get<{
      _id: string;
      title: string;
      seller: string;
      tracking: string;
      status: string;
      origin: string;
      destination: string;
      expectedDate: string;
      creator: string;
    }>(BACKEND_URL + tracking);
  }

  addPost(title: string, seller: string, tracking: string, status: string, origin: string, destination: string, expectedDate: string) {
    const post = {
      title: title,
      seller: seller,
      tracking: tracking,
      status: status,
      origin: origin,
      destination: destination,
      expectedDate: expectedDate
    };
    this.http
      .post<{ message: string, post: Post }>(BACKEND_URL, post)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string,  seller: string, tracking: string, status: string,
    origin: string, destination: string, expectedDate: string) {
    let postData: Post | FormData ;
    postData = new FormData();
    postData.append('id', id);
    postData.append('title', title);
    postData.append('seller', seller);
    postData.append('tracking', tracking);
    postData.append('status', status);
    postData.append('origin', origin);
    postData.append('destination', destination);
    postData.append('expectedDate', expectedDate);
    this.http
    .put(BACKEND_URL + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
