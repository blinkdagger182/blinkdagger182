import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { GET_Service } from '../../../api/get.service';
import { GlobalVariable } from "../../../../../environments/environment";
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs';
interface CachedImage {
    url: string;
    blob: Blob;
   }
@Injectable()
export class ImageService {
private _cacheUrls: string[] = [];
 private _cachedImages: CachedImage[] = [];
 constructor(private http: HttpClient,
    private _GET_api_Service: GET_Service,) { }
 getImage(url: string) : Observable<any> {

    const index = this._cachedImages.findIndex(image => image.url === url);
    if (index > -1) {
    const image = this._cachedImages[index];
    console.log('_cachedImages : index > -1')
    return of(URL.createObjectURL(image.blob));
    }
    else{
    console.log('_cachedImages : index <= -1')
    return this.http.get(url, { responseType: 'blob' }).pipe(
    tap(blob => this.checkAndCacheImage(url, blob))
    );}
 }
 checkAndCacheImage(url: string, blob: Blob) {
    if (this._cacheUrls.indexOf(url) > -1) {
        this._cachedImages.push({url, blob});
        console.log('_cacheUrls : Url  > -1')
    }
    else
    {
        this._GET_api_Service.GET_PictureByUrl(url).subscribe(data => {                        
            if (data) {

                url = url;
                this._cachedImages.push({url, blob});
                console.log('_cacheUrls : Url  <= -1 && data')
            }
            else
            {
                url = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this._cachedImages.push({url, blob});
                console.log('_cacheUrls : Url  <= -1 && !data')
            }
        }, err =>{
    
                url = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this._cachedImages.push({url, blob});
                console.log('_cacheUrls : Url  <= -1 && err')

        });
    }
    } 
set cacheUrls(urls: string[]) {
 this._cacheUrls = urls;
 }
get cacheUrls(): string[] {
 return this._cacheUrls;
 }
set cachedImages(image: CachedImage) {
 this._cachedImages.push(image);
 }
}