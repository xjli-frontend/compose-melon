/*
 * @CreateTime: Apr 10, 2018 3:19 PM
 * @Author: howe
 * @Contact: ihowe@outlook.com
* @Last Modified By: howe
* @Last Modified Time: Nov 28, 2019 5:47 PM
 * @Description: Modify Here, Please 
 * loading指示器
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class turnaround extends cc.Component {
    private _rotate:number = 0;
    onLoad(){

    }
    update(dt){
        this._rotate -= dt*60;
        this.node.angle = this._rotate%360;
        if (this._rotate <- 360){
            this._rotate += 360;
        }
    }
}