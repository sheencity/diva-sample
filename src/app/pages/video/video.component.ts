import { Component, OnDestroy, OnInit } from '@angular/core';
import { VideoConfigDto } from 'src/app/common/dtos/video.dto';
import { DivaService } from 'src/app/common/services/diva.service';

const videos = [
  {
    title: '视频名称1',
  },
  {
    title: '视频名称2',
  },
  {
    title: '视频名称3',
  },
  {
    title: '视频名称4',
  },
  {
    title: '视频名称5',
  },
  {
    title: '视频名称6',
  },
  {
    title: '视频名称7',
  },
  {
    title: '视频名称8',
  },
  {
    title: '视频名称9',
  },
  {
    title: '视频名称10',
  },
];

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  public videos = videos;

  public selectedVideo: string = null;

  public isPlaying = false;

  constructor(private _diva: DivaService) {}

  toggleVideo(video: VideoConfigDto) {
    if (!this.isPlaying && this.selectedVideo !== video.title) {
      this.isPlaying = true;
      this.selectedVideo = video.title;
      this._diva.client.request('PlayCameraTrack', {
        name: video.title,
      })
      return;
    } 
    if (!this.isPlaying && this.selectedVideo === video.title) {
      this.isPlaying = true;
      this._diva.client.request('PlayCameraTrack', {});
      return;
    }
    if (this.isPlaying && this.selectedVideo === video.title) {
      this.isPlaying = false;
      this._diva.client.request('PauseCameraTrack', {});
      return;
    }
    if (this.isPlaying && this.selectedVideo !== video.title) {
      this.selectedVideo = video.title;
      this._diva.client.request('PlayCameraTrack', {
        name: video.title,
      })
      return;
    }
  }

  iconBind(video) {
    if (this.isPlaying && this.selectedVideo === video.title) {
      return 'assets/icon/video/pause.png';
    } else {
      return 'assets/icon/video/play.png';
    }
  }

  ngOnInit(): void {}

  // 销毁钩子
  ngOnDestroy(): void {
    if (this.isPlaying) {
      this._diva.client.request('StopCameraTrack', {});
    }
  }
}
