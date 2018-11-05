import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      seller: new FormControl(null, {validators: [Validators.required]}),
      tracking: new FormControl(null, {validators: [Validators.required]}),
      status: new FormControl(null, {validators: [Validators.required]}),
      origin: new FormControl(null, {validators: [Validators.required]}),
      destination: new FormControl(null, {validators: [Validators.required]}),
      expectedDate: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
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
          this.form.setValue({
            title: this.post.title,
            seller: this.post.seller,
            tracking: this.post.tracking,
            status: this.post.status,
            origin: this.post.origin,
            destination: this.post.destination,
            expectedDate: this.post.expectedDate
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.seller,
        this.form.value.tracking,
        this.form.value.status,
        this.form.value.origin,
        this.form.value.destination,
        this.form.value.expectedDate
        );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.seller,
        this.form.value.tracking,
        this.form.value.status,
        this.form.value.origin,
        this.form.value.destination,
        this.form.value.expectedDate
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
