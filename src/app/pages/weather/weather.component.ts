import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherName } from '@sheencity/diva-sdk';
import { plainToClass } from 'class-transformer';
import { WeatherConfigDto } from 'src/app/common/dtos/weather.dto';
import { DataService } from 'src/app/common/services/data.service';
import { DivaService } from 'src/app/common/services/diva.service';

const weathers = plainToClass(WeatherConfigDto, [
  {
    title: '默认',
    typeName: 'default',
  },
  {
    title: '晴天',
    typeName: WeatherName.Sunny,
  },
  {
    title: '多云',
    typeName: WeatherName.Overcast,
  },
  {
    title: '小雨',
    typeName: WeatherName.Rain,
  },
  {
    title: '暴雨',
    typeName: WeatherName.Storm,
  },
  {
    title: '雾霾',
    typeName: WeatherName.Smog,
  },
  {
    title: '雪天',
    typeName: WeatherName.Snow,
  },
  {
    title: '摄影棚',
    typeName: WeatherName.Studio,
  },
]);

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  public weathers = weathers;

  constructor(private _diva: DivaService, private _data: DataService) {}

  /**
   * 切换天气
   * @param weather (WeatherConfigDto) 天气配置
   * @returns 
   */
  switchWeather(weather: WeatherConfigDto) {
    console.log({ weather });
    if (!weather.typeName) return;
    this._diva.client?.setWether(weather.typeName);
    if (this._diva.client?.setWether) {
      this._data.changeCode(`client.setWether('${weather.typeName}')`);
    }
  }

  /**
   * 根据天气绑定 icon
   * @param weatherName (string) 天气名称
   * @returns 
   */
  iconBind(weatherName: string) {
    return `assets/icon/weather/${weatherName}.png`;
  }

  ngOnInit(): void {
    this._diva.client.applyScene('天气控制');
    this._data.changeCode(`client.applyScene('天气控制')`);
  }

  // 销毁钩子
  ngOnDestroy(): void {}
}
