namespace fish {
    export const SheetProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource): Promise<any> {
            return host.load(resource, "json").then((data) => {
                if (!data.file) {
                    fish.Log.error("SheetProcessor no file in json" + resource.name);
                    return null;
                }
                let r = host.resourceConfig.getResource(RES.nameSelector(data.file));
                if (!r) {
                    let imageUrl = RES.processor.getRelativePath(resource.url, data.file);
                    imageUrl = VersionManager.removeResUrlVersion(imageUrl);
                    r = { name: imageUrl, url: imageUrl, type: 'image', root: "" };
                    RES.$addResourceData({ name: imageUrl, url: imageUrl, type: "image" });
                }
                return host.load(r)
                    .then((bitmapData) => {
                        var frames: any = data.frames;
                        var spriteSheet = new egret.SpriteSheet(bitmapData);
                        spriteSheet["$resourceInfo"] = r;
                        for (var subkey in frames) {
                            var config: any = frames[subkey];
                            var subTexture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                            if (config["scale9grid"]) {
                                var str: string = config["scale9grid"];
                                var list: Array<string> = str.split(",");
                                subTexture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                            }
                        }
                        let sheetData = new SheetData(r.name, bitmapData, data, spriteSheet);
                        host.save(r, bitmapData);
                        return sheetData;
                    }, (e) => {
                        host.remove(r!);
                        throw e;
                    })
            })
        },


        getData(host, resource, key, subkey) {
            let data: SheetData = host.get(resource);
            if (data) {
                return data.getTexture(subkey);
            }
            else {
                return null;
            }
        },

        onRemoveStart(host, resource): Promise<any> {
            let data: SheetData = host.get(resource);
            const r = data.spriteSheet["$resourceInfo"];
            host.unload(r);
            data.dispose();
            return Promise.resolve();
        }
    }
}