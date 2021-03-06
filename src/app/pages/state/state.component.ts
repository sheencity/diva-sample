import { Component, OnDestroy, OnInit } from '@angular/core';
import { Model, RenderingStyleMode } from '@sheencity/diva-sdk';
import { DropdownData } from 'src/app/common/models/dropdown-data.interface';
import { DataService } from 'src/app/common/services/data.service';
import { DivaService } from 'src/app/common/services/diva.service';

const equipments = [
  {
    title: '空调',
    state: RenderingStyleMode.Default,
  },
  {
    title: '电视机',
    state: RenderingStyleMode.Default,
  },
  {
    title: '路由器',
    state: RenderingStyleMode.Default,
  },
  {
    title: '冰箱',
    state: RenderingStyleMode.Default,
  },
] as { title: string; state: RenderingStyleMode }[];

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent implements OnInit, OnDestroy {
  // 选中的设备
  selectedEqui: any = null;
  // 选中的设备的 index 值，为了添加选中文字变白，暂时未使用
  selected: number = null;
  equipments = equipments.map((equipment) => this.addSelected(equipment));
  constructor(private _diva: DivaService, private _data: DataService) {}

  // 状态配置
  options = [
    { value: RenderingStyleMode.Default, placeholder: '默认' },
    { value: RenderingStyleMode.Alarm, placeholder: '报警' },
    { value: RenderingStyleMode.Translucence, placeholder: '半透' },
    { value: RenderingStyleMode.Hidden, placeholder: '隐藏' },
  ] as DropdownData<RenderingStyleMode>[];

  /**
   * 设备添加 selected 属性，方便在循环下拉框组件中绑定值
   * @param equipment 设备
   * @returns
   */
  private addSelected(equipment: { title: string; state: RenderingStyleMode }) {
    let selected: DropdownData<RenderingStyleMode>;
    switch (equipment.state) {
      case RenderingStyleMode.Default:
        selected = { value: RenderingStyleMode.Default, placeholder: '默认' };
        break;
      case RenderingStyleMode.Alarm:
        selected = { value: RenderingStyleMode.Alarm, placeholder: '报警' };
        break;
      case RenderingStyleMode.Translucence:
        selected = { value: RenderingStyleMode.Translucence, placeholder: '半透' };
        break;
      case RenderingStyleMode.Hidden:
        selected = { value: RenderingStyleMode.Hidden, placeholder: '隐藏' };
        break;
      default:
        selected = { value: RenderingStyleMode.Default, placeholder: '默认' };
        break;
    }
    return { ...equipment, selected };
  }

  /**
   * 设置设备的状态
   * @param equi 设备
   * @param $event 选中的状态
   * @returns
   */
  async onChange(
    equi: { title: string; state: RenderingStyleMode },
    $event: DropdownData
  ) {
    const [model] = await this._diva.client.getEntitiesByName<Model>(
      equi.title
    );
    if (!model) return;
    const type = $event.value as RenderingStyleMode;
    model.setRenderingStyleMode(type);

    this._data.changeCode(
      `model.setRenderingStyleMode(RenderingStyleMode.${
        type.slice(0, 1).toUpperCase() + type.slice(1)
      })`
    );
  }

  ngOnInit(): void {
    this._diva.client?.applyScene('状态演示').then(() => {
      this._data.changeCode(`client.applyScene('状态演示')`);
    });
  }

  // 销毁钩子
  ngOnDestroy(): void {
    this.equipments.forEach(async (equi) => {
      const [model] = await this._diva.client.getEntitiesByName<Model>(equi.title);
      model.setRenderingStyleMode(RenderingStyleMode.Default);
    });
  }
}
