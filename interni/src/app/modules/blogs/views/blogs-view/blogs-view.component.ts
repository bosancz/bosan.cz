import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { Blog } from 'app/schema/blog';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { BlogsService } from '../../services/blogs.service';

@Component({
  selector: 'bo-blogs-view',
  templateUrl: './blogs-view.component.html',
  styleUrls: ['./blogs-view.component.scss']
})
export class BlogsViewComponent implements OnInit {

  blog?: Blog;

  actions: Action[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogs: BlogsService,
    private toasts: ToastService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params["id"]) this.load(params["id"]);
    });
  };

  async load(id: string) {
    this.blog = await this.blogs.load(id);
    this.actions = this.getActions(this.blog);
  }

  async delete() {
    if (!this.blog) return;

    const alert = await this.alertController.create({
      header: 'Smazat příspěvek?',
      message: `Opravdu chcete smazat příspěvek „<strong>${this.blog.title}</strong>“?`,
      buttons: [
        { text: 'Zrušit' },
        { text: 'Smazat', handler: () => this.deleteConfirmed() }
      ]
    });

    await alert.present();
  }

  private async deleteConfirmed() {

    if (!this.blog) return;

    const oldData = this.blog;

    await this.blogs.delete(this.blog._id);
    this.toasts.toast("Příspěvek smazán");
    this.router.navigate(["../"], { relativeTo: this.route, replaceUrl: true });
  }

  async publish() {
    if (!this.blog) return;
    await this.blogs.publish(this.blog);
    await this.load(this.blog._id);

    const buttons = [{ text: "Zobrazit příspěvek", handler: () => this.open() }];
    this.toasts.toast("Příspěvek publikován na web", { buttons });
  }

  async unpublish() {
    if (!this.blog) return;
    await this.blogs.unpublish(this.blog);
    await this.load(this.blog._id);
    this.toasts.toast("Příspěvek byl skrytý z webu");
  }

  open() {
    if (!this.blog) return;
    window.open("https://bosan.cz/blog/" + this.blog._id);
  }

  getActions(blog: Blog): Action[] {
    return [
      {
        text: "Upravit",
        icon: "create-outline",
        pinned: true,
        handler: () => this.router.navigate(["upravit"], { relativeTo: this.route })
      },
      {
        text: "Publikovat",
        hidden: blog.status !== "draft",
        handler: () => this.publish()
      },
      {
        text: "Zrušit publikaci",
        icon: "eye-off-outline",
        hidden: blog.status !== "public",
        handler: () => this.unpublish()
      },
      {
        text: "Otevřít na webu",
        icon: "open-outline",
        color: "success",
        disabled: blog.status !== "public",
        handler: () => this.open(),
      },
      {
        text: "Smazat",
        role: "destructive",
        icon: "trash",
        color: "danger",
        handler: () => this.delete(),
      },
    ];
  }

}
