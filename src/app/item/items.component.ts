import { Component, OnInit, inject } from '@angular/core'
import { Page } from '@nativescript/core'

import { Item } from './item'
import { ItemService } from './item.service'

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  page = inject(Page);
  itemService = inject(ItemService);
  items: Array<Item>;

  constructor() {
    // Setup large titles on iOS
    this.page.on('loaded', (args) => {
      if (__IOS__) {
        const navigationController: UINavigationController =
          this.page.frame.ios.controller;
        navigationController.navigationBar.prefersLargeTitles = true;
      }
    });
  }

  ngOnInit(): void {
    this.items = this.itemService.getItems()
  }
}
