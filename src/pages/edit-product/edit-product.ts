import { Product, ProductProvider } from './../../providers/product/product';
import { CategoryProvider } from './../../providers/category/category';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html'
})
export class EditProductPage {
  model: Product;
  categories: any[];
  constructor(
    private navCtrl: NavController, public navParams: NavParams,
    private toatr: ToastController, private productProvider: ProductProvider, private catetegoryProvider: CategoryProvider) {
    this.model = new Product();

    if (this.navParams.data.id) {
      this.productProvider.get(this.navParams.data.id).then((result: any) => {
        this.model = result;
      });
    }

  }


  ionViewDidLoad() {
    this.catetegoryProvider.getAll()
      .then((result: any[]) => {
        this.categories = result;
      })
      .catch(() => {
        this.toatr.create({ message: 'Erro ao carregar as categorias...', duration: 3000, position: 'botton' }).present();
      });
  }

  save() {
    this.saveProduct().then(() => {
      this.toatr.create({ message: 'Produto salvo', duration: 3000, position: 'botton' }).present();
      this.navCtrl.pop();
    }).catch(() => {
      this.toatr.create({ message: 'Erro ao salvar o produto...', duration: 3000, position: 'botton' }).present();
    });
  }
  private saveProduct() {
    if (this.model.id) {
      return this.productProvider.update(this.model);
    } else {
      return this.productProvider.insert(this.model);
    }
  }
}
