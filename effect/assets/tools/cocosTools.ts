class CocosTools {
    /**
     * 获取文件json对象
     *
     * @param {string} path
     * @return {*}  {(Promise<Object | boolean>)}
     * @memberof CocosTools
     */
    getJson(path: string): Promise<Object> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.JsonAsset, (error: Error, retData: cc.JsonAsset) => {
                if (error) {
                    reject(null);
                } else {
                    resolve(retData.json);
                }
            });
        });
    }

    /**
     * 获取路径下的Prefab
     *
     * @param {string} path
     * @return {*}  {(Promise<boolean | cc.Prefab>)}
     * @memberof CocosTools
     */
    getPrefab(path: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.Prefab, (error: Error, retData: cc.Prefab) => {
                if (error) {
                    reject(null);
                } else {
                    resolve(retData);
                }
            });
        });
    }

    getMaterial(path: string): Promise<cc.Material> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.Material, (error: Error, retData: cc.Material) => {
                if (error) {
                    reject(false);
                } else {
                    resolve(retData);
                }
            });
        });
    }
}

export default new CocosTools();
