import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})

export class PostViewComponent implements OnInit, OnDestroy {

  isLoading = false;
  post: Post;
  userIsAuthenticated = false;
  private postTracking: string;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postTracking')) {
        this.postTracking = paramMap.get('postTracking');
        this.isLoading = true;
        this.postsService.getPost(this.postTracking).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            seller: postData.seller,
            tracking: postData.tracking,
            status: postData.status,
            origin: postData.origin,
            destination: postData.destination,
            expectedDate: postData.expectedDate,
            creator: postData.creator
          };
        });
      } else {
        this.postTracking = null;
      }
    });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
