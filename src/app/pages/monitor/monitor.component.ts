import { Component, OnDestroy, OnInit } from '@angular/core';
import { Model, RenderingStyleMode } from '@sheencity/diva-sdk';
import { DataService } from 'src/app/common/services/data.service';
import { DivaService } from 'src/app/common/services/diva.service';

const monitors = [
  {
    title: '测试设备01',
    url: 'rtmp://xxxxxxxxxxxxxxxxxx',
  },
  {
    title: '测试设备02',
    url: 'rtmp://xxxxxxxxxxxxxxxxxx',
  },
  {
    title: '测试设备03',
    url: 'https://www.sheencity.com',
  },
  {
    title: '测试设备04',
    url: 'https://www.sheencity.com',
  },
] as {title: string, url: string}[];

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit, OnDestroy {
  // 监控设备
  monitors = monitors.slice(0, 2);
  // 弹窗设备
  monitorEquis = monitors.slice(2, 4);
  // 设备模型列表
  monitorModels: Model[] = [];
  // 事件句柄列表
  monitorHandlers = [];
  // 选中的监控列表
  selectedMonitorIndex: number = -1;
  constructor(private _diva: DivaService, private _data: DataService) {}

  /**
   * 聚焦监控设备
   * @param monitor (MonitorConfigDto) 监控设备
   * @param index (number) 选中监控的 index 值
   * @param isPop (boolean) 是否为弹窗设备
   */
  async selectMonitor(monitor: {title: string, url: string}, index: number, isPop: boolean) {
    index = isPop ? index + 2 : index;
    await this.monitorModels[index].focus(1000, -Math.PI / 6)
    this.selectedMonitorIndex = index;
    this._data.changeCode(`model.focus(1000, -Math.PI / 6)`);
  }

  /**
   * 更新弹窗设备链接并打开设备的弹窗
   * @param monitorEqui (MonitorEquiConfigDto) 弹窗设备
   * @param index (number) 弹窗设备的 index 值
   */
  async refresh(monitorEqui: {title: string, url: string}, index: number) {
    index = index + 2;
    console.log('monitorEqui is', monitorEqui, index);
    await this.monitorModels[index].setWebWidget(new URL(monitorEqui.url), 500, 280);
    // 此处设置设备网址刷新信息
  }


  /**
   * 阻止事件冒泡
   * @param $event 
   */
  onKeydown($event) {
    $event.stopPropagation();
  }

  async ngOnInit() {
    this._diva.client.applyScene('监控设备')
    for (let i=0; i < 4; i++) {
      let model: Model;
      let url: string;
      if (i < 2) {
        model = (await this._diva.client.getEntitiesByName<Model>(this.monitors[i].title))[0];
        url = this.monitors[i].url;
      } else {
        model = (await this._diva.client.getEntitiesByName<Model>(this.monitorEquis[i - 2].title))[0];
        url = this.monitorEquis[i - 2].url;
      }
      const handle = () => {
        model.setWebWidget(new URL(url), 500, 280);
      }
      model.setRenderingStyleMode(RenderingStyleMode.Default);
      model.addEventListener('click', handle)
      this.monitorModels.push(model);
      this.monitorHandlers.push(handle);
      setTimeout(() => {this._data.changeCode(`client.applyScene('监控设备')`)}, 0);
    }
  }

  // 销毁钩子
  ngOnDestroy(): void {
    this.monitorModels.forEach((monitor, index) => monitor.removeEventListener('click', this.monitorHandlers[index]));
  }
}