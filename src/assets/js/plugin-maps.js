Ext.onReady(function() {
    Ext.define("Ext.ux.button.ColorButton", {
        extend: "Ext.button.Button",
        alias: "widget.colorbutton",
        width: 109,
        height: 22,
        defaultValue: null,
        value: "f1f1f1",
        getValue: function() {
            return this.value
        },
        setValue: function(h) {
            this.value = h;
            if (Ext.isDefined(this.getEl())) {
                this.getEl().dom.style.background = "#" + h
            }
        },
        reset: function() {
            this.setValue(this.defaultValue)
        },
        menu: {},
        menuHandler: function() {},
        initComponent: function() {
            var h = this;
            this.defaultValue = this.value;
            this.menu = Ext.create("Ext.menu.Menu", {
                showSeparator: false,
                items: {
                    xtype: "colorpicker",
                    closeAction: "hide",
                    listeners: {
                        select: function(j, i) {
                            h.setValue(i);
                            h.menu.hide();
                            h.menuHandler(j, i)
                        }
                    }
                }
            });
            this.callParent()
        },
        listeners: {
            render: function() {
                this.setValue(this.value)
            }
        }
    });
    Ext.define("Ext.ux.layout.component.form.MultiSelect", {
        extend: "Ext.layout.component.field.Field",
        alias: ["layout.multiselectfield"],
        type: "multiselectfield",
        defaultHeight: 200,
        sizeBodyContents: function(i, h) {
            var j = this;
            if (!Ext.isNumber(h)) {
                h = j.defaultHeight
            }
            j.owner.panel.setSize(i, h)
        }
    });
    Ext.define("Ext.ux.form.MultiSelect", {
        extend: "Ext.form.field.Base",
        alternateClassName: "Ext.ux.Multiselect",
        alias: ["widget.multiselect", "widget.multiselectfield"],
        uses: ["Ext.view.BoundList", "Ext.form.FieldSet", "Ext.ux.layout.component.form.MultiSelect", "Ext.view.DragZone", "Ext.view.DropZone"],
        ddReorder: false,
        appendOnly: false,
        displayField: "text",
        allowBlank: true,
        minSelections: 0,
        maxSelections: Number.MAX_VALUE,
        blankText: "This field is required",
        minSelectionsText: "Minimum {0} item(s) required",
        maxSelectionsText: "Maximum {0} item(s) allowed",
        delimiter: ",",
        componentLayout: "multiselectfield",
        fieldBodyCls: Ext.baseCSSPrefix + "form-multiselect-body",
        initComponent: function() {
            var h = this;
            h.bindStore(h.store, true);
            if (h.store.autoCreated) {
                h.valueField = h.displayField = "field1";
                if (!h.store.expanded) {
                    h.displayField = "field2"
                }
            }
            if (!Ext.isDefined(h.valueField)) {
                h.valueField = h.displayField
            }
            h.callParent()
        },
        bindStore: function(h, j) {
            var k = this,
                l = k.store,
                i = k.boundList;
            if (l && !j && l !== h && l.autoDestroy) {
                l.destroy()
            }
            k.store = h ? Ext.data.StoreManager.lookup(h) : null;
            if (i) {
                i.bindStore(h || null)
            }
        },
        onRender: function(l, h) {
            var m = this,
                i, k, j;
            m.callParent(arguments);
            k = m.boundList = Ext.create("Ext.view.BoundList", {
                multiSelect: true,
                store: m.store,
                displayField: m.displayField,
                border: false
            });
            j = k.getSelectionModel();
            m.mon(j, {
                selectionChange: m.onSelectionChange,
                scope: m
            });
            i = m.panel = Ext.create("Ext.panel.Panel", {
                title: m.listTitle,
                tbar: m.tbar,
                items: [k],
                renderTo: m.bodyEl,
                layout: "fit"
            });
            i.ownerCt = m;
            m.setRawValue(m.rawValue)
        },
        getSubTplMarkup: function() {
            return ""
        },
        afterRender: function() {
            var h = this;
            h.callParent();
            if (h.ddReorder && !h.dragGroup && !h.dropGroup) {
                h.dragGroup = h.dropGroup = "MultiselectDD-" + Ext.id()
            }
            if (h.draggable || h.dragGroup) {
                h.dragZone = Ext.create("Ext.view.DragZone", {
                    view: h.boundList,
                    ddGroup: h.dragGroup,
                    dragText: "{0} Item{1}"
                })
            }
            if (h.droppable || h.dropGroup) {
                h.dropZone = Ext.create("Ext.view.DropZone", {
                    view: h.boundList,
                    ddGroup: h.dropGroup,
                    handleNodeDrop: function(o, n, i) {
                        var j = this.view,
                            l = j.getStore(),
                            k = o.records,
                            m;
                        o.view.store.remove(k);
                        m = l.indexOf(n);
                        if (i === "after") {
                            m++
                        }
                        l.insert(m, k);
                        j.getSelectionModel().select(k)
                    }
                })
            }
        },
        onSelectionChange: function() {
            this.checkChange()
        },
        clearValue: function() {
            this.setValue([])
        },
        getSubmitValue: function() {
            var i = this,
                h = i.delimiter,
                j = i.getValue();
            return Ext.isString(h) ? j.join(h) : j
        },
        getRawValue: function() {
            var i = this,
                h = i.boundList;
            if (h) {
                i.rawValue = Ext.Array.map(h.getSelectionModel().getSelection(), function(j) {
                    return j.get(i.valueField)
                })
            }
            return i.rawValue
        },
        setRawValue: function(j) {
            var i = this,
                h = i.boundList,
                k;
            j = Ext.Array.from(j);
            i.rawValue = j;
            if (h) {
                k = [];
                Ext.Array.forEach(j, function(n) {
                    var m, l = i.store.findRecord(i.valueField, n, m, m, true, true);
                    if (l) {
                        k.push(l)
                    }
                });
                h.getSelectionModel().select(k, false, true)
            }
            return j
        },
        valueToRaw: function(h) {
            return h
        },
        isEqual: function(m, l) {
            var j = Ext.Array.from,
                k, h;
            m = j(m);
            l = j(l);
            h = m.length;
            if (h !== l.length) {
                return false
            }
            for (k = 0; k < h; k++) {
                if (l[k] !== m[k]) {
                    return false
                }
            }
            return true
        },
        getErrors: function(i) {
            var h = this,
                j = Ext.String.format,
                l = h.callParent(arguments),
                k;
            i = Ext.Array.from(i || h.getValue());
            k = i.length;
            if (!h.allowBlank && k < 1) {
                l.push(h.blankText)
            }
            if (k < this.minSelections) {
                l.push(j(h.minSelectionsText, h.minSelections))
            }
            if (k > this.maxSelections) {
                l.push(j(h.maxSelectionsText, h.maxSelections))
            }
            return l
        },
        onDisable: function() {
            this.callParent();
            this.disabled = true;
            this.updateReadOnly()
        },
        onEnable: function() {
            this.callParent();
            this.disabled = false;
            this.updateReadOnly()
        },
        setReadOnly: function(h) {
            this.readOnly = h;
            this.updateReadOnly()
        },
        updateReadOnly: function() {
            var i = this,
                h = i.boundList,
                j = i.readOnly || i.disabled;
            if (h) {
                h.getSelectionModel().setLocked(j)
            }
        },
        onDestroy: function() {
            Ext.destroyMembers(this, "panel", "boundList", "dragZone", "dropZone");
            this.callParent()
        }
    });
    OpenLayers.Util.OSM = {};
    OpenLayers.Util.OSM.MISSING_TILE_URL = "http://www.openstreetmap.org/openlayers/img/404.png";
    OpenLayers.Util.OSM.originalOnImageLoadError = OpenLayers.Util.onImageLoadError;
    OpenLayers.Util.onImageLoadError = function() {
        if (this.src.match(/^http:\/\/[abc]\.[a-z]+\.openstreetmap\.org\//)) {
            this.src = OpenLayers.Util.OSM.MISSING_TILE_URL
        } else {
            if (this.src.match(/^http:\/\/[def]\.tah\.openstreetmap\.org\//)) {} else {
                OpenLayers.Util.OSM.originalOnImageLoadError
            }
        }
    };
    OpenLayers.Layer.OSM.Mapnik = OpenLayers.Class(OpenLayers.Layer.OSM, {
        initialize: function(j, k) {
            var h = ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png", "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png", "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"];
            k = OpenLayers.Util.extend({
                numZoomLevels: 19,
                buffer: 0,
                transitionEffect: "resize"
            }, k);
            var i = [j, h, k];
            OpenLayers.Layer.OSM.prototype.initialize.apply(this, i)
        },
        CLASS_NAME: "OpenLayers.Layer.OSM.Mapnik"
    });
    OpenLayers.Layer.OSM.Osmarender = OpenLayers.Class(OpenLayers.Layer.OSM, {
        initialize: function(j, k) {
            var h = ["http://a.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png", "http://b.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png", "http://c.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png"];
            k = OpenLayers.Util.extend({
                numZoomLevels: 18,
                buffer: 0,
                transitionEffect: "resize"
            }, k);
            var i = [j, h, k];
            OpenLayers.Layer.OSM.prototype.initialize.apply(this, i)
        },
        CLASS_NAME: "OpenLayers.Layer.OSM.Osmarender"
    });
    OpenLayers.Layer.OSM.CycleMap = OpenLayers.Class(OpenLayers.Layer.OSM, {
        initialize: function(j, k) {
            var h = ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png", "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png", "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"];
            k = OpenLayers.Util.extend({
                numZoomLevels: 19,
                buffer: 0,
                transitionEffect: "resize"
            }, k);
            var i = [j, h, k];
            OpenLayers.Layer.OSM.prototype.initialize.apply(this, i)
        },
        CLASS_NAME: "OpenLayers.Layer.OSM.CycleMap"
    });
    OpenLayers.Control.Circle = OpenLayers.Class(OpenLayers.Control, {
        feature: null,
        layer: null,
        radius: 5,
        origin: null,
        sides: 40,
        angle: null,
        snapAngle: null,
        dragControl: null,
        initialize: function(h) {
            OpenLayers.Control.prototype.initialize.apply(this, arguments)
        },
        activate: function() {
            var i = OpenLayers.Control.prototype.activate.call(this);
            if (i) {
                var h = {
                    displayInLayerSwitcher: false,
                    calculateInRange: function() {
                        return true
                    }
                };
                this.map.addLayer(this.layer)
            }
            return i
        },
        deactivate: function() {
            var h = OpenLayers.Control.prototype.deactivate.call(this);
            if (h) {
                if (this.layer.map != null) {
                    this.layer.destroy(false);
                    if (this.feature) {
                        this.feature.destroy()
                    }
                }
                this.layer = null;
                this.feature = null
            }
            return h
        },
        createGeometry: function() {
            this.angle = Math.PI * ((1 / this.sides) - (1 / 2));
            if (this.snapAngle) {
                this.angle += this.snapAngle * (Math.PI / 180)
            }
            this.feature.geometry = OpenLayers.Geometry.Polygon.createRegularPolygon(this.origin, this.radius, this.sides, this.snapAngle)
        },
        modifyGeometry: function() {
            var j, m, h, i;
            var l = this.feature.geometry.components[0];
            if (l.components.length != (this.sides + 1)) {
                this.createGeometry();
                l = this.feature.geometry.components[0]
            }
            for (var k = 0; k < this.sides; ++k) {
                i = l.components[k];
                j = this.angle + (k * 2 * Math.PI / this.sides);
                i.x = this.origin.x + (this.radius * Math.cos(j));
                i.y = this.origin.y + (this.radius * Math.sin(j));
                i.clearBounds()
            }
        },
        updateCircle: function(h, i) {
            this.origin = new OpenLayers.Geometry.Point(h.lon, h.lat);
            this.radius = i * 1;
            if (!this.feature) {
                this.feature = new OpenLayers.Feature.Vector();
                this.createGeometry();
                this.layer.addFeatures([this.feature], {
                    silent: true
                })
            } else {
                this.modifyGeometry()
            }
            this.layer.drawFeature(this.feature, this.style)
        },
        CLASS_NAME: "Meteorage.Circle"
    });
    OpenLayers.Control.newSelectFeature = OpenLayers.Class(OpenLayers.Control, {
        multipleKey: null,
        toggleKey: null,
        multiple: false,
        clickout: true,
        toggle: false,
        hover: false,
        onSelect: function() {},
        onUnselect: function() {},
        onHoverSelect: function() {},
        onHoverUnselect: function() {},
        onClickSelect: function() {},
        onClickUnselect: function() {},
        geometryTypes: null,
        layer: null,
        callbacks: null,
        selectStyle: null,
        renderIntent: "select",
        handler: null,
        initialize: function(j, i) {
            OpenLayers.Control.prototype.initialize.apply(this, [i]);
            this.layer = j;
            this.callbacks = OpenLayers.Util.extend({
                click: this.clickFeature,
                clickout: this.clickoutFeature,
                over: this.overFeature,
                out: this.outFeature
            }, this.callbacks);
            var h = {
                geometryTypes: this.geometryTypes
            };
            this.handler = new OpenLayers.Handler.Feature(this, j, this.callbacks, h)
        },
        unselectAll: function(h) {
            var k;
            for (var j = this.layer.selectedFeatures.length - 1; j >= 0; --j) {
                k = this.layer.selectedFeatures[j];
                if (!h || h.except != k) {
                    this.unselect(k, "click")
                }
            }
        },
        clickFeature: function(h) {
            if ((this.onSelect.name != "" || this.onClickSelect.name != "") && !this.hover) {
                var i = (OpenLayers.Util.indexOf(this.layer.selectedFeatures, h) > -1);
                if (i) {
                    if (this.toggleSelect()) {
                        this.unselect(h)
                    } else {
                        if (!this.multipleSelect()) {
                            this.unselectAll({
                                except: h
                            })
                        }
                    }
                } else {
                    if (!this.multipleSelect()) {
                        this.unselectAll({
                            except: h
                        })
                    }
                }
                this.select(h, "click")
            }
        },
        multipleSelect: function() {
            return this.multiple || this.handler.evt[this.multipleKey]
        },
        toggleSelect: function() {
            return this.toggle || this.handler.evt[this.toggleKey]
        },
        clickoutFeature: function(h) {
            if (((this.onClickUnselect.name != "" || this.onHoverSelect.name == "") && !this.hover) && this.clickout) {
                this.unselectAll()
            }
        },
        overFeature: function(h) {
            if ((this.onHoverSelect.name != "" || this.hover) && (OpenLayers.Util.indexOf(this.layer.selectedFeatures, h) == -1)) {
                this.select(h, "hover")
            }
        },
        outFeature: function(h) {
            if (this.onHoverUnselect.name != "" || this.hover) {
                this.unselect(h, "hover")
            }
        },
        select: function(j, h) {
            this.layer.selectedFeatures.push(j);
            var i = this.selectStyle || this.renderIntent;
            this.layer.drawFeature(j, i);
            this.layer.events.triggerEvent("featureselected", {
                feature: j
            });
            switch (h) {
                case "hover":
                    this.onHoverSelect(j);
                    break;
                case "click":
                    if (this.onClickSelect.name != "") {
                        this.onClickSelect(j)
                    } else {
                        if (this.onSelect.name != "") {
                            this.onSelect(j)
                        }
                    }
                    break;
                default:
                    this.onSelect(j);
                    break
            }
        },
        unselect: function(i, h) {
            this.layer.drawFeature(i, "default");
            OpenLayers.Util.removeItem(this.layer.selectedFeatures, i);
            this.layer.events.triggerEvent("featureunselected", {
                feature: i
            });
            switch (h) {
                case "hover":
                    this.onHoverUnselect(i);
                    break;
                case "click":
                    if (this.onClickUnselect.name != "") {
                        this.onClickUnselect(i)
                    } else {
                        if (this.onUnselect.name != "") {
                            this.onUnselect(i)
                        }
                    }
                    break;
                default:
                    this.onUnselect(i);
                    break
            }
        },
        setMap: function(h) {
            this.handler.setMap(h);
            OpenLayers.Control.prototype.setMap.apply(this, arguments)
        },
        CLASS_NAME: "OpenLayers.Control.newSelectFeature"
    });
    Ext.define("GeoExt.data.LayerModel", {
        alternateClassName: "GeoExt.data.LayerRecord",
        extend: "Ext.data.Model",
        requires: ["Ext.data.proxy.Memory", "Ext.data.reader.Json"],
        alias: "model.gx_layer",
        statics: {
            createFromLayer: function(h) {
                return this.proxy.reader.readRecords([h]).records[0]
            }
        },
        fields: ["id", {
            name: "title",
            type: "string",
            mapping: "name"
        }, {
            name: "legendURL",
            type: "string",
            mapping: "metadata.legendURL"
        }, {
            name: "hideTitle",
            type: "bool",
            mapping: "metadata.hideTitle"
        }, {
            name: "hideInLegend",
            type: "bool",
            mapping: "metadata.hideInLegend"
        }],
        proxy: {
            type: "memory",
            reader: {
                type: "json"
            }
        },
        getLayer: function() {
            return this.raw
        }
    });
    Ext.define("GeoExt.data.LayerStore", {
        requires: ["GeoExt.data.LayerModel"],
        extend: "Ext.data.Store",
        model: "GeoExt.data.LayerModel",
        statics: {
            MAP_TO_STORE: 1,
            STORE_TO_MAP: 2
        },
        map: null,
        constructor: function(h) {
            var k = this;
            h = Ext.apply({}, h);
            var j = (GeoExt.MapPanel && h.map instanceof GeoExt.MapPanel) ? h.map.map : h.map;
            delete h.map;
            if (h.layers) {
                h.data = h.layers
            }
            delete h.layers;
            var i = {
                initDir: h.initDir
            };
            delete h.initDir;
            k.callParent([h]);
            if (j) {
                this.bind(j, i)
            }
        },
        bind: function(j, i) {
            var h = this;
            if (h.map) {
                return
            }
            h.map = j;
            i = Ext.apply({}, i);
            var l = i.initDir;
            if (i.initDir == undefined) {
                l = GeoExt.data.LayerStore.MAP_TO_STORE | GeoExt.data.LayerStore.STORE_TO_MAP
            }
            var k = j.layers.slice(0);
            if (l & GeoExt.data.LayerStore.STORE_TO_MAP) {
                h.each(function(m) {
                    h.map.addLayer(m.getLayer())
                }, h)
            }
            if (l & GeoExt.data.LayerStore.MAP_TO_STORE) {
                h.loadRawData(k, true)
            }
            j.events.on({
                changelayer: h.onChangeLayer,
                addlayer: h.onAddLayer,
                removelayer: h.onRemoveLayer,
                scope: h
            });
            h.on({
                load: h.onLoad,
                clear: h.onClear,
                add: h.onAdd,
                remove: h.onRemove,
                update: h.onUpdate,
                scope: h
            });
            h.data.on({
                replace: h.onReplace,
                scope: h
            });
            h.fireEvent("bind", h, j)
        },
        unbind: function() {
            var h = this;
            if (h.map) {
                h.map.events.un({
                    changelayer: h.onChangeLayer,
                    addlayer: h.onAddLayer,
                    removelayer: h.onRemoveLayer,
                    scope: h
                });
                h.un("load", h.onLoad, h);
                h.un("clear", h.onClear, h);
                h.un("add", h.onAdd, h);
                h.un("remove", h.onRemove, h);
                h.data.un("replace", h.onReplace, h);
                h.map = null
            }
        },
        onChangeLayer: function(h) {
            var j = h.layer;
            var l = this.findBy(function(n, m) {
                return n.getLayer() === j
            });
            if (l > -1) {
                var i = this.getAt(l);
                if (h.property === "order") {
                    if (!this._adding && !this._removing) {
                        var k = this.map.getLayerIndex(j);
                        if (k !== l) {
                            this._removing = true;
                            this.remove(i);
                            delete this._removing;
                            this._adding = true;
                            this.insert(k, [i]);
                            delete this._adding
                        }
                    }
                } else {
                    if (h.property === "name") {
                        i.set("title", j.name)
                    } else {
                        this.fireEvent("update", this, i, Ext.data.Record.EDIT)
                    }
                }
            }
        },
        onAddLayer: function(h) {
            var j = this;
            if (!j._adding) {
                j._adding = true;
                var i = j.proxy.reader.read(h.layer);
                j.add(i.records);
                delete j._adding
            }
        },
        onRemoveLayer: function(i) {
            if (this.map.unloadDestroy) {
                if (!this._removing) {
                    var h = i.layer;
                    this._removing = true;
                    this.remove(this.getByLayer(h));
                    delete this._removing
                }
            } else {
                this.unbind()
            }
        },
        onLoad: function(n, h, j) {
            if (j) {
                if (!Ext.isArray(h)) {
                    h = [h]
                }
                if (!this._addRecords) {
                    this._removing = true;
                    for (var l = this.map.layers.length - 1; l >= 0; l--) {
                        this.map.removeLayer(this.map.layers[l])
                    }
                    delete this._removing
                }
                var i = h.length;
                if (i > 0) {
                    var k = new Array(i);
                    for (var m = 0; m < i; m++) {
                        k[m] = h[m].getLayer()
                    }
                    this._adding = true;
                    this.map.addLayers(k);
                    delete this._adding
                }
            }
            delete this._addRecords
        },
        onClear: function(i) {
            this._removing = true;
            for (var h = this.map.layers.length - 1; h >= 0; h--) {
                this.map.removeLayer(this.map.layers[h])
            }
            delete this._removing
        },
        onAdd: function(h, i, l) {
            if (!this._adding) {
                this._adding = true;
                var j;
                for (var k = i.length - 1; k >= 0; --k) {
                    j = i[k].getLayer();
                    this.map.addLayer(j);
                    if (l !== this.map.layers.length - 1) {
                        this.map.setLayerIndex(j, l)
                    }
                }
                delete this._adding
            }
        },
        onRemove: function(h, i, k) {
            if (!this._removing) {
                var j = i.getLayer();
                if (this.map.getLayer(j.id) != null) {
                    this._removing = true;
                    this.removeMapLayer(i);
                    delete this._removing
                }
            }
        },
        onUpdate: function(l, i, h) {
            if (h === Ext.data.Record.EDIT) {
                if (i.modified && i.modified.title) {
                    var k = i.getLayer();
                    var j = i.get("title");
                    if (j !== k.name) {
                        k.setName(j)
                    }
                }
            }
        },
        removeMapLayer: function(h) {
            this.map.removeLayer(h.getLayer())
        },
        onReplace: function(j, i, h) {
            this.removeMapLayer(i)
        },
        getByLayer: function(h) {
            var i = this.findBy(function(j) {
                return j.getLayer() === h
            });
            if (i > -1) {
                return this.getAt(i)
            }
        },
        destroy: function() {
            var h = this;
            h.unbind();
            h.callParent()
        },
        loadRecords: function(i, h) {
            if (h && h.addRecords) {
                this._addRecords = true
            }
            this.callParent(arguments)
        }
    });
    Ext.define("GeoExt.panel.Map", {
        extend: "Ext.panel.Panel",
        requires: ["GeoExt.data.LayerStore"],
        alias: "widget.gx_mappanel",
        alternateClassName: "GeoExt.MapPanel",
        statics: {
            guess: function() {
                var h = Ext.ComponentQuery.query("gx_mappanel");
                return ((h && h.length > 0) ? h[0] : null)
            }
        },
        center: null,
        zoom: null,
        extent: null,
        prettyStateKeys: false,
        map: null,
        layers: null,
        stateEvents: ["aftermapmove", "afterlayervisibilitychange", "afterlayeropacitychange", "afterlayerorderchange", "afterlayernamechange", "afterlayeradd", "afterlayerremove"],
        initComponent: function() {
            if (!(this.map instanceof OpenLayers.Map)) {
                this.map = new OpenLayers.Map(Ext.applyIf(this.map || {}, {
                    allOverlays: true
                }))
            }
            var h = this.layers;
            if (!h || h instanceof Array) {
                this.layers = Ext.create("GeoExt.data.LayerStore", {
                    layers: h,
                    map: this.map.layers.length > 0 ? this.map : null
                })
            }
            if (Ext.isString(this.center)) {
                this.center = OpenLayers.LonLat.fromString(this.center)
            } else {
                if (Ext.isArray(this.center)) {
                    this.center = new OpenLayers.LonLat(this.center[0], this.center[1])
                }
            }
            if (Ext.isString(this.extent)) {
                this.extent = OpenLayers.Bounds.fromString(this.extent)
            } else {
                if (Ext.isArray(this.extent)) {
                    this.extent = OpenLayers.Bounds.fromArray(this.extent)
                }
            }
            this.callParent(arguments);
            this.on("resize", this.onResize, this);
            this.on("afterlayout", function() {
                if (typeof this.map.getViewport === "function") {
                    this.items.each(function(i) {
                        if (typeof i.addToMapPanel === "function") {
                            i.getEl().appendTo(this.map.getViewport())
                        }
                    }, this)
                }
            }, this);
            this.map.events.on({
                moveend: this.onMoveend,
                changelayer: this.onChangelayer,
                addlayer: this.onAddlayer,
                removelayer: this.onRemovelayer,
                scope: this
            })
        },
        onMoveend: function(h) {
            this.fireEvent("aftermapmove", this, this.map, h)
        },
        onChangelayer: function(h) {
            var i = this.map;
            if (h.property) {
                if (h.property === "visibility") {
                    this.fireEvent("afterlayervisibilitychange", this, i, h)
                } else {
                    if (h.property === "order") {
                        this.fireEvent("afterlayerorderchange", this, i, h)
                    } else {
                        if (h.property === "nathis") {
                            this.fireEvent("afterlayernathischange", this, i, h)
                        } else {
                            if (h.property === "opacity") {
                                this.fireEvent("afterlayeropacitychange", this, i, h)
                            }
                        }
                    }
                }
            }
        },
        onAddlayer: function() {
            this.fireEvent("afterlayeradd")
        },
        onRemovelayer: function() {
            this.fireEvent("afterlayerremove")
        },
        onResize: function() {
            var h = this.map;
            if (this.body.dom !== h.div) {
                h.render(this.body.dom);
                this.layers.bind(h);
                if (h.layers.length > 0) {
                    this.setInitialExtent()
                } else {
                    this.layers.on("add", this.setInitialExtent, this, {
                        single: true
                    })
                }
            } else {
                h.updateSize()
            }
        },
        setInitialExtent: function() {
            var h = this.map;
            if (!h.getCenter()) {
                if (this.center || this.zoom) {
                    h.setCenter(this.center, this.zoom)
                } else {
                    if (this.extent instanceof OpenLayers.Bounds) {
                        h.zoomToExtent(this.extent, true)
                    } else {
                        h.zoomToMaxExtent()
                    }
                }
            }
        },
        getState: function() {
            var l = this,
                j = l.map,
                k = l.callParent(arguments) || {},
                h;
            if (!j) {
                return
            }
            var i = j.getCenter();
            i && Ext.applyIf(k, {
                x: i.lon,
                y: i.lat,
                zoom: j.getZoom()
            });
            l.layers.each(function(m) {
                h = m.getLayer();
                layerId = this.prettyStateKeys ? m.get("title") : m.get("id");
                k = l.addPropertyToState(k, "visibility_" + layerId, h.getVisibility());
                k = l.addPropertyToState(k, "opacity_" + layerId, (h.opacity === null) ? 1 : h.opacity)
            }, l);
            return k
        },
        applyState: function(r) {
            var i = this;
            map = i.map;
            i.center = new OpenLayers.LonLat(r.x, r.y);
            i.zoom = r.zoom;
            var m, p, l, o, q, k;
            var n = map.layers;
            for (m = 0, p = n.length; m < p; m++) {
                l = n[m];
                o = i.prettyStateKeys ? l.name : l.id;
                q = r["visibility_" + o];
                if (q !== undefined) {
                    q = (/^true$/i).test(q);
                    if (l.isBaseLayer) {
                        if (q) {
                            map.setBaseLayer(l)
                        }
                    } else {
                        l.setVisibility(q)
                    }
                }
                k = r["opacity_" + o];
                if (k !== undefined) {
                    l.setOpacity(k)
                }
            }
        },
        onBeforeAdd: function(h) {
            if (Ext.isFunction(h.addToMapPanel)) {
                h.addToMapPanel(this)
            }
            this.callParent(arguments)
        },
        beforeDestroy: function() {
            if (this.map && this.map.events) {
                this.map.events.un({
                    moveend: this.onMoveend,
                    changelayer: this.onChangelayer,
                    scope: this
                })
            }
            if (!this.initialConfig.map || !(this.initialConfig.map instanceof OpenLayers.Map)) {
                if (this.map && this.map.destroy) {
                    this.map.destroy()
                }
            }
            delete this.map;
            this.callParent(arguments)
        }
    });
    Ext.define("GeoExt.tree.Column", {
        extend: "Ext.tree.Column",
        alias: "widget.gx_treecolumn",
        initComponent: function() {
            var h = this;
            h.callParent();
            var i = h.renderer;
            this.renderer = function(l, p, q, m, k, o, r) {
                var n = [i(l, p, q, m, k, o, r)];
                if (q.get("checkedGroup")) {
                    n[0] = n[0].replace(/class="([^-]+)-tree-checkbox([^"]+)?"/, 'class="$1-tree-checkbox$2 gx-tree-radio"')
                }
                n.push('<div class="gx-tree-component gx-tree-component-off" id="tree-record-' + q.id + '"></div>');
                if (q.uiProvider && q.uiProvider instanceof "string") {}
                return n.join("")
            }
        },
        defaultRenderer: function(h) {
            return h
        }
    });
    Ext.define("GeoExt.tree.View", {
        extend: "Ext.tree.View",
        alias: "widget.gx_treeview",
        initComponent: function() {
            var h = this;
            h.on("itemupdate", this.onItem, this);
            h.on("itemadd", this.onItem, this);
            h.on("createchild", this.createChild, this);
            return h.callParent(arguments)
        },
        onItem: function(i, m, j, h) {
            var k = this;
            if (!(i instanceof Array)) {
                i = [i]
            }
            for (var l = 0; l < i.length; l++) {
                this.onNodeRendered(i[l])
            }
        },
        onNodeRendered: function(j) {
            var h = this;
            var i = Ext.get("tree-record-" + j.id);
            if (!i) {
                return
            }
            if (j.get("layer")) {
                h.fireEvent("createchild", i, j)
            }
            if (j.hasChildNodes()) {
                j.eachChild(function(k) {
                    h.onNodeRendered(k)
                }, h)
            }
        },
        createChild: function(h, j) {
            var i = j.get("component");
            if (i) {
                cmpObj = Ext.ComponentManager.create(i);
                cmpObj.render(h);
                h.removeCls("gx-tree-component-off")
            }
        }
    });
    Ext.define("GeoExt.tree.LayerNode", {
        extend: "Ext.AbstractPlugin",
        alias: "plugin.gx_layer",
        init: function(h) {
            this.target = h;
            var i = h.get("layer");
            h.set("checked", i.getVisibility());
            if (!h.get("checkedGroup") && i.isBaseLayer) {
                h.set("checkedGroup", "gx_baselayer")
            }
            h.set("fixedText", !!h.text);
            h.set("leaf", true);
            if (!h.get("iconCls")) {
                h.set("iconCls", "gx-tree-layer-icon")
            }
            h.on("afteredit", this.onAfterEdit, this);
            i.events.on({
                visibilitychanged: this.onLayerVisibilityChanged,
                scope: this
            })
        },
        onAfterEdit: function(j, i) {
            var h = this;
            if (~Ext.Array.indexOf(i, "checked")) {
                h.onCheckChange()
            }
        },
        onLayerVisibilityChanged: function() {
            if (!this._visibilityChanging) {
                this.target.set("checked", this.target.get("layer").getVisibility())
            }
        },
        onCheckChange: function() {
            var j = this.target,
                h = this.target.get("checked");
            if (h != j.get("layer").getVisibility()) {
                j._visibilityChanging = true;
                var i = j.get("layer");
                if (h && i.isBaseLayer && i.map) {
                    i.map.setBaseLayer(i)
                } else {
                    i.setVisibility(h)
                }
                delete j._visibilityChanging
            }
        }
    });
    Ext.define("GeoExt.tree.LayerLoader", {
        extend: "Ext.util.Observable",
        requires: ["GeoExt.tree.LayerNode"],
        store: null,
        filter: function(h) {
            return h.getLayer().displayInLayerSwitcher === true
        },
        baseAttrs: null,
        load: function(h) {
            if (this.fireEvent("beforeload", this, h)) {
                this.removeStoreHandlers();
                while (h.firstChild) {
                    h.removeChild(h.firstChild)
                }
                if (!this.store) {
                    this.store = GeoExt.MapPanel.guess().layers
                }
                this.store.each(function(i) {
                    this.addLayerNode(h, i)
                }, this);
                this.addStoreHandlers(h);
                this.fireEvent("load", this, h)
            }
        },
        onStoreAdd: function(h, i, n, k) {
            if (!this._reordering) {
                var j = k.get("container").recordIndexToNodeIndex(n + i.length - 1, k);
                for (var m = 0, l = i.length; m < l; ++m) {
                    this.addLayerNode(k, i[m], j)
                }
            }
        },
        onStoreRemove: function(i, h) {
            if (!this._reordering) {
                this.removeLayerNode(h, i)
            }
        },
        addLayerNode: function(k, i, h) {
            h = h || 0;
            if (this.filter(i) === true) {
                var l = i.getLayer();
                var j = this.createNode({
                    plugins: [{
                        ptype: "gx_layer"
                    }],
                    layer: l,
                    text: l.name,
                    listeners: {
                        move: this.onChildMove,
                        scope: this
                    }
                });
                if (h !== undefined) {
                    k.insertChild(h, j)
                } else {
                    k.appendChild(j)
                }
                k.getChildAt(h).on("move", this.onChildMove, this)
            }
        },
        removeLayerNode: function(h, i) {
            if (this.filter(i) === true) {
                var j = h.findChildBy(function(k) {
                    return k.get("layer") == i.getLayer()
                });
                if (j) {
                    j.un("move", this.onChildMove, this);
                    j.remove()
                }
            }
        },
        onChildMove: function(v, n, m, q) {
            var p = this,
                r = p.store.getByLayer(v.get("layer")),
                w = m.get("container"),
                s = w.loader;
            p._reordering = true;
            if (s instanceof p.self && p.store === s.store) {
                s._reordering = true;
                p.store.remove(r);
                var x;
                if (m.childNodes.length > 1) {
                    var o = (q === 0) ? q + 1 : q - 1;
                    x = p.store.findBy(function(h) {
                        return m.childNodes[o].get("layer") === h.getLayer()
                    });
                    if (q === 0) {
                        x++
                    }
                } else {
                    if (n.parentNode === m.parentNode) {
                        var u = m;
                        do {
                            u = u.previousSibling
                        } while (u && !(u.get("container") instanceof w.self && u.lastChild));
                        if (u) {
                            x = p.store.findBy(function(h) {
                                return u.lastChild.get("layer") === h.getLayer()
                            })
                        } else {
                            var t = m;
                            do {
                                t = t.nextSibling
                            } while (t && !(t.get("container") instanceof w.self && t.firstChild));
                            if (t) {
                                x = p.store.findBy(function(h) {
                                    return t.firstChild.get("layer") === h.getLayer()
                                })
                            }
                            x++
                        }
                    }
                }
                if (x !== undefined) {
                    p.store.insert(x, [r])
                } else {
                    p.store.insert(oldRecordIndex, [r])
                }
                delete s._reordering
            }
            delete p._reordering
        },
        addStoreHandlers: function(h) {
            if (!this._storeHandlers) {
                this._storeHandlers = {
                    add: function(l, j, k) {
                        this.onStoreAdd(l, j, k, h)
                    },
                    remove: function(k, j) {
                        this.onStoreRemove(j, h)
                    }
                };
                for (var i in this._storeHandlers) {
                    this.store.on(i, this._storeHandlers[i], this)
                }
            }
        },
        removeStoreHandlers: function() {
            if (this._storeHandlers) {
                for (var h in this._storeHandlers) {
                    this.store.un(h, this._storeHandlers[h], this)
                }
                delete this._storeHandlers
            }
        },
        createNode: function(h) {
            if (this.baseAttrs) {
                Ext.apply(h, this.baseAttrs)
            }
            return h
        },
        destroy: function() {
            this.removeStoreHandlers()
        }
    });
    Ext.define("GeoExt.tree.LayerContainer", {
        extend: "Ext.AbstractPlugin",
        requires: ["GeoExt.tree.LayerLoader"],
        alias: "plugin.gx_layercontainer",
        defaultText: "Layers",
        init: function(j) {
            var h = this;
            var i = h.loader;
            h.loader = (i && i instanceof GeoExt.tree.LayerLoader) ? i : new GeoExt.tree.LayerLoader(i);
            j.set("container", h);
            if (!j.get("text")) {
                j.set("text", h.defaultText);
                j.commit()
            }
            h.loader.load(j)
        },
        recordIndexToNodeIndex: function(p, l) {
            var m = this;
            var i = m.loader.store;
            var n = i.getCount();
            var j = l.childNodes.length;
            var k = -1;
            for (var o = n - 1; o >= 0; --o) {
                if (m.loader.filter(i.getAt(o)) === true) {
                    ++k;
                    if (p === o || k > j - 1) {
                        break
                    }
                }
            }
            return k
        }
    });
    Ext.define("GeoExt.tree.BaseLayerContainer", {
        extend: "GeoExt.tree.LayerContainer",
        alias: "plugin.gx_baselayercontainer",
        defaultText: "Base Layers",
        init: function(j) {
            var h = this;
            var i = h.loader;
            h.loader = Ext.applyIf(i || {}, {
                baseAttrs: Ext.applyIf((i && i.baseAttrs) || {}, {
                    iconCls: "gx-tree-baselayer-icon",
                    checkedGroup: "baselayer"
                }),
                filter: function(l) {
                    var k = l.getLayer();
                    return k.displayInLayerSwitcher === true && k.isBaseLayer === true
                }
            });
            h.callParent(arguments)
        }
    });
    Ext.define("GeoExt.tree.Panel", {
        extend: "Ext.tree.Panel",
        alias: "widget.gx_treepanel",
        requires: ["GeoExt.tree.Column", "GeoExt.tree.View"],
        viewType: "gx_treeview",
        initComponent: function() {
            var h = this;
            if (!h.columns) {
                if (h.initialConfig.hideHeaders === undefined) {
                    h.hideHeaders = true
                }
                h.addCls(Ext.baseCSSPrefix + "autowidth-table");
                h.columns = [{
                    xtype: "gx_treecolumn",
                    text: "Name",
                    width: Ext.isIE6 ? null : 10000,
                    dataIndex: h.displayField
                }]
            }
            h.callParent()
        }
    });
    Ext.Ajax.method = "GET";
    Ext.isIE = function() {
        return /trident/.test(Ext.userAgent)
    }();
    GIS = {
        core: {
            instances: []
        },
        i18n: {},
        isDebug: false,
        isSessionStorage: "sessionStorage" in window && window.sessionStorage !== null,
        logg: []
    };
    GIS.core.getOLMap = function(i) {
        var j, h;
        h = function(l, n) {
            var m, k;
            m = new OpenLayers.Control.Button({
                displayClass: "olControlButton",
                trigger: function() {
                    n.call(i.olmap)
                }
            });
            k = new OpenLayers.Control.Panel({
                defaultControl: m
            });
            k.addControls([m]);
            j.addControl(k);
            k.div.className += " " + l;
            k.div.childNodes[0].className += " " + l + "Button"
        };
        j = new OpenLayers.Map({
            controls: [new OpenLayers.Control.Navigation({
                zoomWheelEnabled: true,
                documentDrag: true
            }), new OpenLayers.Control.MousePosition({
                prefix: '<span id="mouseposition" class="el-fontsize-10"><span class="text-mouseposition-lonlat">LON </span>',
                separator: '<span class="text-mouseposition-lonlat">,&nbsp;LAT </span>',
                suffix: '<div id="google-logo" name="http://www.google.com/intl/en-US_US/help/terms_maps.html" onclick="window.open(Ext.get(this).dom.attributes.name.nodeValue);"></div></span>'
            }), new OpenLayers.Control.Permalink(), new OpenLayers.Control.ScaleLine({
                geodesic: true,
                maxWidth: 170,
                minWidth: 100
            })],
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            mouseMove: {},
            relocate: {}
        });
        j.events.register("mousemove", null, function(k) {
            i.olmap.mouseMove.x = k.clientX;
            i.olmap.mouseMove.y = k.clientY
        });
        j.zoomToVisibleExtent = function() {
            i.util.map.zoomToVisibleExtent(this)
        };
        j.closeAllLayers = function() {
            i.layer.event.core.reset();
            i.layer.facility.core.reset();
            i.layer.boundary.core.reset();
            i.layer.thematic1.core.reset();
            i.layer.thematic2.core.reset();
            i.layer.thematic3.core.reset();
            i.layer.thematic4.core.reset()
        };
        h("zoomIn", j.zoomIn);
        h("zoomOut", j.zoomOut);
        h("zoomVisible", j.zoomToVisibleExtent);
        h("measure", function() {
            GIS.core.MeasureWindow(i).show()
        });
        return j
    };
    GIS.core.getLayers = function(h) {
        var n = {},
            j, l = ["1", "2", "3", "4"];
        if (window.google) {
            n.googleStreets = new OpenLayers.Layer.Google("Google Streets", {
                numZoomLevels: 20,
                animationEnabled: true,
                layerType: h.conf.finals.layer.type_base,
                layerOpacity: 1,
                setLayerOpacity: function(i) {
                    if (i) {
                        this.layerOpacity = parseFloat(i)
                    }
                    this.setOpacity(this.layerOpacity)
                }
            });
            n.googleStreets.id = "googleStreets";
            n.googleHybrid = new OpenLayers.Layer.Google("Google Hybrid", {
                type: google.maps.MapTypeId.HYBRID,
                numZoomLevels: 20,
                animationEnabled: true,
                layerType: h.conf.finals.layer.type_base,
                layerOpacity: 1,
                setLayerOpacity: function(i) {
                    if (i) {
                        this.layerOpacity = parseFloat(i)
                    }
                    this.setOpacity(this.layerOpacity)
                }
            });
            n.googleHybrid.id = "googleHybrid"
        }
        n.openStreetMap = new OpenLayers.Layer.OSM.Mapnik("OpenStreetMap", {
            layerType: h.conf.finals.layer.type_base,
            layerOpacity: 1,
            setLayerOpacity: function(i) {
                if (i) {
                    this.layerOpacity = parseFloat(i)
                }
                this.setOpacity(this.layerOpacity)
            }
        });
        n.openStreetMap.id = "openStreetMap";
        n.event = GIS.core.VectorLayer(h, "event", GIS.i18n.event_layer, {
            opacity: h.conf.layout.layer.opacity
        });
        n.event.core = new mapfish.GeoStat.Event(h.olmap, {
            layer: n.event,
            gis: h
        });
        n.facility = GIS.core.VectorLayer(h, "facility", GIS.i18n.facility_layer, {
            opacity: 1
        });
        n.facility.core = new mapfish.GeoStat.Facility(h.olmap, {
            layer: n.facility,
            gis: h
        });
        n.boundary = GIS.core.VectorLayer(h, "boundary", GIS.i18n.boundary_layer, {
            opacity: h.conf.layout.layer.opacity
        });
        n.boundary.core = new mapfish.GeoStat.Boundary(h.olmap, {
            layer: n.boundary,
            gis: h
        });
        for (var k = 0, m; k < l.length; k++) {
            m = l[k];
            n["thematic" + m] = GIS.core.VectorLayer(h, "thematic" + m, GIS.i18n.thematic_layer + " " + m, {
                opacity: h.conf.layout.layer.opacity
            });
            n["thematic" + m].layerCategory = h.conf.finals.layer.category_thematic, n["thematic" + m].core = new mapfish.GeoStat["Thematic" + m](h.olmap, {
                layer: n["thematic" + m],
                gis: h
            })
        }
        return n
    };
    GIS.core.createSelectHandlers = function(r, k) {
        var u = !!GIS.app ? !!r.init.user.isAdmin : false,
            v = {},
            n, h, j, i, l, q = r.conf.finals.dimension,
            s, p, m = k.id === "boundary",
            t = k.id === "event";
        h = function o(x) {
            if (m) {
                var y = k.core.getDefaultFeatureStyle();
                y.fillOpacity = 0.15;
                y.strokeColor = x.style.strokeColor;
                y.strokeWidth = x.style.strokeWidth;
                y.label = x.style.label;
                y.fontFamily = x.style.fontFamily;
                y.fontWeight = x.style.strokeWidth > 1 ? "bold" : "normal";
                y.labelAlign = x.style.labelAlign;
                y.labelYOffset = x.style.labelYOffset;
                k.drawFeature(x, y)
            }
            if (s) {
                s.destroy()
            }
            s = Ext.create("Ext.window.Window", {
                cls: "gis-window-widget-feature gis-plugin",
                preventHeader: true,
                shadow: false,
                resizable: false,
                items: {
                    html: x.attributes.popupText
                }
            });
            s.show();
            var B = r.viewport.eastRegion.getPosition()[0],
                A = r.viewport.centerRegion.getPosition()[0],
                z = A + ((B - A) / 2),
                w = r.viewport.centerRegion.getPosition()[1] + (GIS.app ? 32 : 0);
            s.setPosition(z - (s.getWidth() / 2), w)
        };
        j = function o(w) {
            s.destroy()
        };
        i = function o(E) {
            var D, C, x, y, z, B = E.geometry.CLASS_NAME === r.conf.finals.openLayers.point_classname,
                A = E.attributes;
            C = function() {
                if (r.olmap.relocate.window) {
                    r.olmap.relocate.window.destroy()
                }
                r.olmap.relocate.window = Ext.create("Ext.window.Window", {
                    title: "Relocate facility",
                    layout: "fit",
                    iconCls: "gis-window-title-icon-relocate",
                    cls: "gis-container-default",
                    setMinWidth: function(F) {
                        this.setWidth(this.getWidth() < F ? F : this.getWidth())
                    },
                    items: {
                        html: A.name,
                        cls: "gis-container-inner"
                    },
                    bbar: ["->", {
                        xtype: "button",
                        hideLabel: true,
                        text: GIS.i18n.cancel,
                        handler: function() {
                            r.olmap.relocate.active = false;
                            r.olmap.relocate.window.destroy();
                            r.olmap.getViewport().style.cursor = "auto"
                        }
                    }],
                    listeners: {
                        close: function() {
                            r.olmap.relocate.active = false;
                            r.olmap.getViewport().style.cursor = "auto"
                        }
                    }
                });
                r.olmap.relocate.window.show();
                r.olmap.relocate.window.setMinWidth(220);
                r.util.gui.window.setPositionTopRight(r.olmap.relocate.window)
            };
            D = function() {
                Ext.Ajax.request({
                    url: r.init.contextPath + "/api/organisationUnits/" + A.id + ".json?links=false",
                    success: function(G) {
                        var F = Ext.decode(G.responseText);
                        if (k.infrastructuralWindow) {
                            k.infrastructuralWindow.destroy()
                        }
                        k.infrastructuralWindow = Ext.create("Ext.window.Window", {
                            title: GIS.i18n.information,
                            layout: "column",
                            iconCls: "gis-window-title-icon-information",
                            cls: "gis-container-default",
                            width: 460,
                            height: 400,
                            period: null,
                            items: [{
                                cls: "gis-container-inner",
                                columnWidth: 0.4,
                                bodyStyle: "padding-right:4px",
                                items: function() {
                                    var H = [];
                                    if (A.name) {
                                        H.push({
                                            html: GIS.i18n.name,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: A.name,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (F.parent) {
                                        H.push({
                                            html: GIS.i18n.parent_unit,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: F.parent.name,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (F.code) {
                                        H.push({
                                            html: GIS.i18n.code,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: F.code,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (F.address) {
                                        H.push({
                                            html: GIS.i18n.address,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: F.address,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (F.email) {
                                        H.push({
                                            html: GIS.i18n.email,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: F.email,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (F.phoneNumber) {
                                        H.push({
                                            html: GIS.i18n.phone_number,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: F.phoneNumber,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (Ext.isString(F.coordinates)) {
                                        var K = F.coordinates.replace("[", "").replace("]", "").replace(",", ", ");
                                        H.push({
                                            html: GIS.i18n.coordinate,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: K,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    if (Ext.isArray(F.organisationUnitGroups) && F.organisationUnitGroups.length) {
                                        var J = "";
                                        for (var I = 0; I < F.organisationUnitGroups.length; I++) {
                                            J += F.organisationUnitGroups[I].name;
                                            J += I < F.organisationUnitGroups.length - 1 ? "<br/>" : ""
                                        }
                                        H.push({
                                            html: GIS.i18n.groups,
                                            cls: "gis-panel-html-title"
                                        }, {
                                            html: J,
                                            cls: "gis-panel-html"
                                        }, {
                                            cls: "gis-panel-html-separator"
                                        })
                                    }
                                    return H
                                }()
                            }, {
                                xtype: "form",
                                cls: "gis-container-inner gis-form-widget",
                                columnWidth: 0.6,
                                bodyStyle: "padding-left:4px",
                                items: [{
                                    html: GIS.i18n.infrastructural_data,
                                    cls: "gis-panel-html-title"
                                }, {
                                    cls: "gis-panel-html-separator"
                                }, {
                                    xtype: "combo",
                                    fieldLabel: GIS.i18n.period,
                                    editable: false,
                                    valueField: "id",
                                    displayField: "name",
                                    emptyText: "Select period",
                                    forceSelection: true,
                                    width: 258,
                                    labelWidth: 70,
                                    store: {
                                        fields: ["id", "name"],
                                        data: function() {
                                            var H = r.init.systemSettings.infrastructuralPeriodType.id,
                                                K = r.init.periodGenerator,
                                                J = K.filterFuturePeriodsExceptCurrent(K.generateReversedPeriods(H, this.periodOffset)) || [];
                                            if (Ext.isArray(J) && J.length) {
                                                for (var I = 0; I < J.length; I++) {
                                                    J[I].id = J[I].iso
                                                }
                                                J = J.slice(0, 5)
                                            }
                                            return J
                                        }()
                                    },
                                    lockPosition: false,
                                    listeners: {
                                        select: function(J) {
                                            var L = J.getValue(),
                                                H = r.init.contextPath + "/api/analytics.json?",
                                                K = r.init.systemSettings.infrastructuralDataElementGroup;
                                            if (K && K.dataElements) {
                                                H += "dimension=dx:";
                                                for (var I = 0; I < K.dataElements.length; I++) {
                                                    H += K.dataElements[I].id;
                                                    H += I < K.dataElements.length - 1 ? ";" : ""
                                                }
                                            }
                                            H += "&filter=pe:" + L;
                                            H += "&filter=ou:" + A.id;
                                            Ext.Ajax.request({
                                                url: H,
                                                success: function(O) {
                                                    var M = Ext.decode(O.responseText),
                                                        P = [];
                                                    if (Ext.isArray(M.rows)) {
                                                        for (var N = 0; N < M.rows.length; N++) {
                                                            P.push({
                                                                name: M.metaData.names[M.rows[N][0]],
                                                                value: M.rows[N][1]
                                                            })
                                                        }
                                                    }
                                                    k.widget.infrastructuralDataElementValuesStore.loadData(P)
                                                }
                                            })
                                        }
                                    }
                                }, {
                                    xtype: "grid",
                                    cls: "gis-grid",
                                    height: 300,
                                    width: 258,
                                    scroll: "vertical",
                                    columns: [{
                                        id: "name",
                                        text: "Data element",
                                        dataIndex: "name",
                                        sortable: true,
                                        width: 195
                                    }, {
                                        id: "value",
                                        header: "Value",
                                        dataIndex: "value",
                                        sortable: true,
                                        width: 63
                                    }],
                                    disableSelection: true,
                                    store: k.widget.infrastructuralDataElementValuesStore
                                }]
                            }],
                            listeners: {
                                show: function() {
                                    if (n) {
                                        this.down("combo").setValue(n);
                                        infrastructuralDataElementValuesStore.load({
                                            params: {
                                                periodId: n,
                                                organisationUnitId: A.internalId
                                            }
                                        })
                                    }
                                }
                            }
                        });
                        k.infrastructuralWindow.show();
                        r.util.gui.window.setPositionTopRight(k.infrastructuralWindow)
                    }
                })
            };
            x = function(J, H, I) {
                var G = Ext.clone(k.core.view),
                    F;
                G.parentGraphMap = {};
                G.parentGraphMap[J] = H;
                G.rows = [{
                    dimension: q.organisationUnit.objectName,
                    items: [{
                        id: J
                    }, {
                        id: "LEVEL-" + I
                    }]
                }];
                if (G) {
                    F = k.core.getLoader();
                    F.updateGui = true;
                    F.zoomToVisibleExtent = true;
                    F.hideMask = true;
                    F.load(G)
                }
            };
            var w = [];
            if (k.id !== "facility") {
                w.push(Ext.create("Ext.menu.Item", {
                    text: "Float up",
                    iconCls: "gis-menu-item-icon-float",
                    cls: "gis-plugin",
                    disabled: !A.hasCoordinatesUp,
                    handler: function() {
                        x(A.grandParentId, A.grandParentParentGraph, parseInt(A.level) - 1)
                    }
                }));
                w.push(Ext.create("Ext.menu.Item", {
                    text: "Drill down",
                    iconCls: "gis-menu-item-icon-drill",
                    cls: "gis-menu-item-first gis-plugin",
                    disabled: !A.hasCoordinatesDown,
                    handler: function() {
                        x(A.id, A.parentGraph, parseInt(A.level) + 1)
                    }
                }))
            }
            if (u && B) {
                if (k.id !== "facility") {
                    w.push({
                        xtype: "menuseparator"
                    })
                }
                w.push(Ext.create("Ext.menu.Item", {
                    text: GIS.i18n.relocate,
                    iconCls: "gis-menu-item-icon-relocate",
                    disabled: !r.init.user.isAdmin,
                    handler: function(F) {
                        r.olmap.relocate.active = true;
                        r.olmap.relocate.feature = E;
                        r.olmap.getViewport().style.cursor = "crosshair";
                        C()
                    }
                }));
                w.push(Ext.create("Ext.menu.Item", {
                    text: "Swap lon/lat",
                    iconCls: "gis-menu-item-icon-relocate",
                    disabled: !r.init.user.isAdmin,
                    handler: function(F) {
                        var H = E.attributes.id,
                            G = Ext.clone(E.geometry).transform("EPSG:900913", "EPSG:4326");
                        if (Ext.isNumber(G.x) && Ext.isNumber(G.y) && r.init.user.isAdmin) {
                            Ext.Ajax.request({
                                url: r.init.contextPath + "/api/organisationUnits/" + H + ".json?links=false",
                                success: function(I) {
                                    var J = Ext.decode(I.responseText);
                                    J.coordinates = "[" + G.y.toFixed(5) + "," + G.x.toFixed(5) + "]";
                                    Ext.Ajax.request({
                                        url: r.init.contextPath + "/api/metaData?preheatCache=false",
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        params: Ext.encode({
                                            organisationUnits: [J]
                                        }),
                                        success: function(L) {
                                            var K = E.geometry.x,
                                                M = E.geometry.y;
                                            delete E.geometry.bounds;
                                            E.geometry.x = M;
                                            E.geometry.y = K;
                                            k.redraw();
                                            console.log(E.attributes.name + " relocated to " + J.coordinates)
                                        }
                                    })
                                }
                            })
                        }
                    }
                }));
                w.push(Ext.create("Ext.menu.Item", {
                    text: GIS.i18n.show_information_sheet,
                    iconCls: "gis-menu-item-icon-information",
                    handler: function(F) {
                        D()
                    }
                }))
            }
            if (w.length) {
                w[w.length - 1].addCls("gis-menu-item-last")
            }
            y = new Ext.menu.Menu({
                baseCls: "gis-plugin gis-popupmenu",
                shadow: false,
                showSeparator: false,
                defaults: {
                    bodyStyle: "padding-right:6px"
                },
                items: w
            });
            y.showAt([r.olmap.mouseMove.x, r.olmap.mouseMove.y])
        };
        v = {
            onHoverSelect: h,
            onHoverUnselect: j,
            onClickSelect: i
        };
        if (t) {
            v.onClickSelect = function o(E) {
                var A = ["label", "value", "nameColumnMap", "psi", "ps", "longitude", "latitude", "eventdate", "ou", "oucode", "ouname", "popupText"],
                    y = E.attributes,
                    w = y.nameColumnMap,
                    z = '<table class="padding1">',
                    C = ' style="font-weight:bold; padding-right:10px; vertical-align:top"',
                    x = ' style="max-width:170px"',
                    B;
                z += "<tr><td" + C + ">" + w.ou + "</td><td" + x + ">" + y.ouname + "</td></tr>";
                z += "<tr><td" + C + ">" + w.eventdate + "</td><td" + x + ">" + y.eventdate + "</td></tr>";
                z += "<tr><td" + C + ">" + w.longitude + "</td><td" + x + ">" + y.longitude + "</td></tr>";
                z += "<tr><td" + C + ">" + w.latitude + "</td><td" + x + ">" + y.latitude + "</td></tr>";
                for (var D in y) {
                    if (y.hasOwnProperty(D) && !Ext.Array.contains(A, D)) {
                        z += "<tr><td" + C + ">" + w[D] + "</td><td>" + y[D] + "</td></tr>"
                    }
                }
                z += "</table>";
                if (Ext.isObject(p) && p.destroy) {
                    B = p.getPosition();
                    p.destroy();
                    p = null
                }
                p = Ext.create("Ext.window.Window", {
                    title: "Event",
                    layout: "fit",
                    resizable: false,
                    bodyStyle: "background-color:#fff; padding:5px",
                    html: z,
                    autoShow: true,
                    listeners: {
                        show: function(F) {
                            if (B) {
                                F.setPosition(B)
                            } else {
                                r.util.gui.window.setPositionTopRight(F)
                            }
                        },
                        destroy: function() {
                            p = null
                        }
                    }
                })
            }
        }
        l = new OpenLayers.Control.newSelectFeature(k, v);
        r.olmap.addControl(l);
        l.activate()
    };
    GIS.core.StyleMap = function(i) {
        var j = {
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWidth: 1,
                pointRadius: 8,
                labelAlign: "cr",
                labelYOffset: 13,
                fontFamily: '"Arial","Sans-serif","Roboto","Helvetica","Consolas"'
            },
            h = {
                fillOpacity: 0.9,
                strokeColor: "#fff",
                strokeWidth: 1,
                pointRadius: 8,
                cursor: "pointer",
                labelAlign: "cr",
                labelYOffset: 13
            };
        if (Ext.isObject(i) && i.labels) {
            j.label = "${label}";
            j.fontSize = i.labelFontSize;
            j.fontWeight = i.labelFontWeight;
            j.fontStyle = i.labelFontStyle;
            j.fontColor = i.labelFontColor
        }
        return new OpenLayers.StyleMap({
            "default": j,
            select: h
        })
    };
    GIS.core.VectorLayer = function(h, l, j, i) {
        var k = new OpenLayers.Layer.Vector(j, {
            strategies: [new OpenLayers.Strategy.Refresh({
                force: true
            })],
            styleMap: GIS.core.StyleMap(),
            visibility: false,
            displayInLayerSwitcher: false,
            layerType: h.conf.finals.layer.type_vector,
            layerOpacity: i ? i.opacity || 1 : 1,
            setLayerOpacity: function(m) {
                if (m) {
                    this.layerOpacity = parseFloat(m)
                }
                this.setOpacity(this.layerOpacity)
            },
            hasLabels: false
        });
        k.id = l;
        return k
    };
    GIS.core.MeasureWindow = function(h) {
        var j, i, k, m, l;
        l = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style()
        });
        m = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
            persist: true,
            immediate: true,
            handlerOption: {
                layerOptions: {
                    styleMap: l
                }
            }
        });
        k = function(n) {
            if (n.measure) {
                i.setText(n.measure.toFixed(2) + " " + n.units)
            }
        };
        h.olmap.addControl(m);
        m.events.on({
            measurepartial: k,
            measure: k
        });
        m.geodesic = true;
        m.activate();
        i = Ext.create("Ext.form.Label", {
            style: "height: 20px",
            text: "0 km"
        });
        j = Ext.create("Ext.window.Window", {
            title: GIS.i18n.measure_distance,
            layout: "fit",
            cls: "gis-container-default gis-plugin",
            bodyStyle: "text-align: center",
            width: 130,
            minWidth: 130,
            resizable: false,
            items: i,
            listeners: {
                show: function() {
                    var n = h.viewport.eastRegion.getPosition()[0] - this.getWidth() - 3,
                        o = h.viewport.centerRegion.getPosition()[1] + 26;
                    this.setPosition(n, o)
                },
                destroy: function() {
                    m.deactivate();
                    h.olmap.removeControl(m)
                }
            }
        });
        return j
    };
    GIS.core.MapLoader = function(i) {
        var m, k, n, l, j = [],
            h;
        m = function() {
            var q = GIS.plugin && !GIS.app,
                r = q ? "jsonp" : "json",
                p = i.init.contextPath + "/api/maps/" + i.map.id + "." + r + "?fields=" + i.conf.url.mapFields.join(","),
                s, o;
            s = function(y) {
                if (Ext.isArray(y.mapViews)) {
                    for (var w = 0, t; w < y.mapViews.length; w++) {
                        t = y.mapViews[w];
                        if (t) {
                            if (Ext.isArray(t.columns) && t.columns.length) {
                                for (var v = 0, z; v < t.columns.length; v++) {
                                    z = t.columns[v];
                                    if (Ext.isArray(z.items) && z.items.length) {
                                        for (var u = 0, x; u < z.items.length; u++) {
                                            x = z.items[u];
                                            x.id = x.id.replace("#", ".")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                i.map = y;
                k()
            };
            o = function(t) {
                i.olmap.mask.hide();
                if (Ext.Array.contains([403], t.status)) {
                    alert(GIS.i18n.you_do_not_have_access_to_all_items_in_this_favorite)
                } else {
                    alert(t.status + "\n" + t.statusText + "\n" + t.responseText)
                }
            };
            if (q) {
                Ext.data.JsonP.request({
                    url: p,
                    success: function(t) {
                        s(t)
                    }
                })
            } else {
                Ext.Ajax.request({
                    url: p,
                    success: function(t) {
                        s(Ext.decode(t.responseText))
                    }
                })
            }
        };
        k = function() {
            var p = i.map.mapViews,
                o;
            if (!(Ext.isArray(p) && p.length)) {
                i.olmap.mask.hide();
                alert(GIS.i18n.favorite_outdated_create_new);
                return
            }
            for (var q = 0; q < p.length; q++) {
                p[q] = i.api.layout.Layout(p[q])
            }
            p = Ext.Array.clean(p);
            if (!p.length) {
                return
            }
            if (i.viewport && i.viewport.favoriteWindow && i.viewport.favoriteWindow.isVisible()) {
                i.viewport.favoriteWindow.destroy()
            }
            i.olmap.closeAllLayers();
            for (var q = 0, r; q < p.length; q++) {
                r = p[q];
                o = i.layer[r.layer].core.getLoader();
                o.updateGui = !i.el;
                o.callBack = l;
                o.load(r)
            }
        };
        l = function(o) {
            j.push(o);
            if (j.length === i.map.mapViews.length) {
                n()
            }
        };
        n = function() {
            j = [];
            if (i.el) {
                i.olmap.zoomToVisibleExtent()
            } else {
                if (i.map.longitude && i.map.latitude && i.map.zoom) {
                    i.olmap.setCenter(new OpenLayers.LonLat(i.map.longitude, i.map.latitude), i.map.zoom)
                } else {
                    i.olmap.zoomToVisibleExtent()
                }
            }
            if (i.viewport.shareButton) {
                i.viewport.shareButton.enable()
            }
            if (GIS.isSessionStorage) {
                i.util.layout.setSessionStorage("map", i.util.layout.getAnalytical())
            }
            i.olmap.mask.hide()
        };
        h = {
            load: function(o) {
                i.olmap.mask.show();
                if (i.map && i.map.id) {
                    m()
                } else {
                    if (o) {
                        i.map = {
                            mapViews: o
                        }
                    }
                    k()
                }
            }
        };
        return h
    };
    GIS.core.LayerLoaderEvent = function(q, j) {
        var i = j.map,
            k, m, l, h, p, n, o = q.conf.finals.dimension;
        m = function(r) {
            l(r)
        };
        l = function(r) {
            var w = "?",
                u = [],
                v;
            r = r || j.core.view;
            w += "stage=" + r.stage.id;
            w += "&startDate=" + r.startDate;
            w += "&endDate=" + r.endDate;
            if (Ext.isArray(r.organisationUnits)) {
                w += "&dimension=ou:";
                for (var t = 0; t < r.organisationUnits.length; t++) {
                    w += r.organisationUnits[t].id;
                    w += t < r.organisationUnits.length - 1 ? ";" : ""
                }
            }
            for (var t = 0, s; t < r.dataElements.length; t++) {
                s = r.dataElements[t];
                w += "&dimension=" + s.dimension + (s.filter ? ":" + s.filter : "")
            }
            v = function(y) {
                var H = [],
                    B = [],
                    J = [],
                    x, C, A = Ext.clone(y.metaData.names);
                for (var F = 0; F < y.headers.length; F++) {
                    A[y.headers[F].name] = y.headers[F].column;
                    if (y.headers[F].name === "longitude") {
                        x = F
                    }
                    if (y.headers[F].name === "latitude") {
                        C = F
                    }
                }
                if (Ext.isArray(y.rows) && y.rows.length) {
                    for (var F = 0, I; F < y.rows.length; F++) {
                        I = y.rows[F];
                        if (I[x] && I[C]) {
                            J.push(I)
                        }
                    }
                }
                if (!J.length) {
                    alert("No event coordinates found");
                    i.mask.hide();
                    return
                }
                A = y.metaData.names;
                for (var F = 0; F < y.headers.length; F++) {
                    A[y.headers[F].name] = y.headers[F].column
                }
                for (var F = 0, I, E; F < J.length; F++) {
                    I = J[F];
                    E = {};
                    for (var D = 0; D < I.length; D++) {
                        E[y.headers[D].name] = I[D]
                    }
                    E[q.conf.finals.widget.value] = 0;
                    E.label = E.ouname;
                    E.popupText = E.ouname;
                    E.nameColumnMap = A;
                    H.push(E)
                }
                for (var F = 0, z, G; F < H.length; F++) {
                    z = H[F];
                    G = q.util.map.getTransformedPointByXY(z.longitude, z.latitude);
                    B.push(new OpenLayers.Feature.Vector(G, z))
                }
                j.removeFeatures(j.features);
                j.addFeatures(B);
                h(r)
            };
            if (Ext.isObject(GIS.app)) {
                Ext.Ajax.request({
                    url: q.init.contextPath + "/api/analytics/events/query/" + r.program.id + ".json" + w,
                    disableCaching: false,
                    failure: function(x) {
                        alert(x.status + "\n" + x.statusText + "\n" + x.responseText)
                    },
                    success: function(x) {
                        v(Ext.decode(x.responseText))
                    }
                })
            } else {
                if (Ext.isObject(GIS.plugin)) {
                    Ext.data.JsonP.request({
                        url: q.init.contextPath + "/api/analytics/events/query/" + r.program.id + ".jsonp" + w,
                        disableCaching: false,
                        scope: this,
                        success: function(x) {
                            v(x)
                        }
                    })
                }
            }
        };
        h = function(r) {
            r = r || j.core.view;
            var s = {
                indicator: q.conf.finals.widget.value,
                method: 2,
                numClasses: 5,
                colors: j.core.getColors("000000", "222222"),
                minSize: 5,
                maxSize: 5
            };
            j.core.view = r;
            j.core.applyClassification(s);
            p(r)
        };
        p = function(r) {
            if (j.item) {
                j.item.setValue(true, r.opacity)
            } else {
                j.setLayerOpacity(r.opacity)
            }
            if (n.updateGui && Ext.isObject(j.widget)) {
                j.widget.setGui(r)
            }
            if (n.zoomToVisibleExtent) {
                i.zoomToVisibleExtent()
            }
            if (n.hideMask) {
                i.mask.hide()
            }
            if (n.callBack) {
                n.callBack(j)
            } else {
                q.map = null
            }
        };
        n = {
            compare: false,
            updateGui: false,
            zoomToVisibleExtent: false,
            hideMask: false,
            callBack: null,
            load: function(r) {
                q.olmap.mask.show();
                m(r)
            },
            loadData: l,
            loadLegend: h
        };
        return n
    };
    GIS.core.LayerLoaderFacility = function(q, k) {
        var i = k.map,
            l, n, m, h, j, p, o;
        l = function(t, w) {
            var y = k.core.view,
                x, s, r, u;
            o.zoomToVisibleExtent = true;
            if (!y) {
                if (w) {
                    n(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            x = [];
            s = t.rows[0];
            r = [];
            u = y.rows[0];
            if (s.items.length === u.items.length) {
                for (var v = 0; v < s.items.length; v++) {
                    x.push(s.items[v].id)
                }
                for (var v = 0; v < u.items.length; v++) {
                    r.push(u.items[v].id)
                }
                if (Ext.Array.difference(x, r).length !== 0) {
                    if (w) {
                        n(t)
                    }
                    return q.conf.finals.widget.loadtype_organisationunit
                }
            } else {
                if (w) {
                    n(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            o.zoomToVisibleExtent = false;
            if (t.organisationUnitGroupSet.id !== y.organisationUnitGroupSet.id) {
                if (w) {
                    n(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            if (w) {
                h(t);
                return q.conf.finals.widget.loadtype_legend
            }
        };
        n = function(r) {
            var s = r.rows[0].items,
                v = GIS.plugin && !GIS.app,
                u = function() {
                    var y = "?ou=ou:";
                    for (var x = 0; x < s.length; x++) {
                        y += s[x].id;
                        y += x !== s.length - 1 ? ";" : ""
                    }
                    y += "&displayProperty=" + q.init.userAccount.settings.keyAnalysisDisplayProperty.toUpperCase();
                    return q.init.contextPath + "/api/geoFeatures." + (v ? "jsonp" : "json") + y + "&viewClass=detailed"
                }(),
                w, t;
            w = function(z) {
                var x = k.core.decode(z),
                    A = new OpenLayers.Format.GeoJSON(),
                    y = q.util.map.getTransformedFeatureArray(A.read(x));
                if (!Ext.isArray(y)) {
                    i.mask.hide();
                    alert(GIS.i18n.invalid_coordinates);
                    return
                }
                if (!y.length) {
                    i.mask.hide();
                    alert(GIS.i18n.no_valid_coordinates_found);
                    return
                }
                k.core.featureStore.loadFeatures(y.slice(0));
                m(r, y)
            };
            t = function() {
                i.mask.hide();
                alert(GIS.i18n.coordinates_could_not_be_loaded)
            };
            if (GIS.plugin && !GIS.app) {
                Ext.data.JsonP.request({
                    url: u,
                    disableCaching: false,
                    success: function(x) {
                        w(x)
                    }
                })
            } else {
                Ext.Ajax.request({
                    url: u,
                    disableCaching: false,
                    success: function(x) {
                        w(Ext.decode(x.responseText))
                    }
                })
            }
        };
        m = function(r, t) {
            r = r || k.core.view;
            t = t || k.core.featureStore.features;
            for (var s = 0; s < t.length; s++) {
                t[s].attributes.popupText = t[s].attributes.name + " (" + t[s].attributes[r.organisationUnitGroupSet.id] + ")"
            }
            k.removeFeatures(k.features);
            k.addFeatures(t);
            h(r)
        };
        h = function(s) {
            var u = GIS.plugin && !GIS.app,
                w = u ? "jsonp" : "json",
                t = q.init.contextPath + "/api/organisationUnitGroupSets/" + s.organisationUnitGroupSet.id + "." + w + "?fields=organisationUnitGroups[id,name,symbol]",
                x;
            s = s || k.core.view;
            for (var v = 0, r; v < k.features.length; v++) {
                r = k.features[v].attributes;
                r.label = s.labels ? r.name : ""
            }
            k.styleMap = GIS.core.StyleMap(s);
            x = function(z) {
                var A = z.organisationUnitGroups,
                    y = {
                        indicator: s.organisationUnitGroupSet.id
                    };
                q.store.groupsByGroupSet.loadData(A);
                k.core.view = s;
                k.core.applyClassification({
                    indicator: s.organisationUnitGroupSet.id
                });
                j(s);
                p(s)
            };
            if (u) {
                Ext.data.JsonP.request({
                    url: t,
                    success: function(y) {
                        x(y)
                    }
                })
            } else {
                Ext.Ajax.request({
                    url: t,
                    success: function(y) {
                        x(Ext.decode(y.responseText))
                    }
                })
            }
        };
        j = function(s) {
            var r = s.areaRadius;
            if (k.circleLayer) {
                k.circleLayer.deactivateControls();
                k.circleLayer = null
            }
            if (Ext.isDefined(r) && r) {
                k.circleLayer = GIS.app.CircleLayer(k.features, r);
                nissa = k.circleLayer
            }
        };
        p = function(r) {
            q.viewport.eastRegion.doLayout();
            k.legendPanel.expand();
            if (k.item) {
                k.item.setValue(true, r.opacity)
            } else {
                k.setLayerOpacity(r.opacity)
            }
            if (o.updateGui && Ext.isObject(k.widget)) {
                k.widget.setGui(r)
            }
            if (o.zoomToVisibleExtent) {
                i.zoomToVisibleExtent()
            }
            if (o.hideMask) {
                i.mask.hide()
            }
            if (o.callBack) {
                o.callBack(k)
            } else {
                q.map = null;
                if (q.viewport.shareButton) {
                    q.viewport.shareButton.enable()
                }
            }
        };
        o = {
            compare: false,
            updateGui: false,
            zoomToVisibleExtent: false,
            hideMask: false,
            callBack: null,
            load: function(r) {
                q.olmap.mask.show();
                if (this.compare) {
                    l(r, true)
                } else {
                    n(r)
                }
            },
            loadData: m,
            loadLegend: h
        };
        return o
    };
    GIS.core.LayerLoaderBoundary = function(p, j) {
        var i = j.map,
            k, m, l, h, o, n;
        k = function(s, v) {
            var x = j.core.view,
                w, r, q, t;
            if (!x) {
                if (v) {
                    m(s)
                }
                return p.conf.finals.widget.loadtype_organisationunit
            }
            w = [];
            r = s.rows[0];
            q = [];
            t = x.rows[0];
            if (r.items.length === t.items.length) {
                for (var u = 0; u < r.items.length; u++) {
                    w.push(r.items[u].id)
                }
                for (var u = 0; u < t.items.length; u++) {
                    q.push(t.items[u].id)
                }
                if (Ext.Array.difference(w, q).length !== 0) {
                    if (v) {
                        m(s)
                    }
                    return p.conf.finals.widget.loadtype_organisationunit
                }
                if (v) {
                    n.zoomToVisibleExtent = false;
                    h(s)
                }
                return p.conf.finals.widget.loadtype_legend
            } else {
                if (v) {
                    m(s)
                }
                return p.conf.finals.widget.loadtype_organisationunit
            }
            p.olmap.mask.hide()
        };
        m = function(q) {
            var r = q.rows[0].items,
                u = GIS.plugin && !GIS.app,
                t = function() {
                    var x = "?ou=ou:";
                    for (var w = 0; w < r.length; w++) {
                        x += r[w].id;
                        x += w !== r.length - 1 ? ";" : ""
                    }
                    x += "&displayProperty=" + p.init.userAccount.settings.keyAnalysisDisplayProperty.toUpperCase();
                    return p.init.contextPath + "/api/geoFeatures." + (u ? "jsonp" : "json") + x
                }(),
                v, s;
            v = function(w) {
                var x = p.util.geojson.decode(w, "DESC"),
                    E = new OpenLayers.Format.GeoJSON(),
                    z = p.util.map.getTransformedFeatureArray(E.read(x)),
                    y = ["black", "blue", "red", "green", "yellow"],
                    F = [],
                    A = {};
                if (!Ext.isArray(z)) {
                    i.mask.hide();
                    alert(GIS.i18n.invalid_coordinates);
                    return
                }
                if (!z.length) {
                    i.mask.hide();
                    alert(GIS.i18n.no_valid_coordinates_found);
                    return
                }
                for (var C = 0; C < z.length; C++) {
                    F.push(parseFloat(z[C].attributes.level))
                }
                F = Ext.Array.unique(F).sort();
                for (var C = 0; C < F.length; C++) {
                    A[F[C]] = {
                        strokeColor: y[C]
                    }
                }
                for (var C = 0, G, B, D; C < z.length; C++) {
                    G = z[C];
                    B = A[G.attributes.level];
                    D = F.length === 1 ? 1 : G.attributes.level == 2 ? 2 : 1;
                    G.style = {
                        strokeColor: B.strokeColor || "black",
                        strokeWidth: D,
                        fillOpacity: 0,
                        pointRadius: 5,
                        labelAlign: "cr",
                        labelYOffset: 13
                    }
                }
                j.core.featureStore.loadFeatures(z.slice(0));
                l(q, z)
            };
            s = function() {
                i.mask.hide();
                alert(GIS.i18n.coordinates_could_not_be_loaded)
            };
            if (u) {
                Ext.data.JsonP.request({
                    url: t,
                    disableCaching: false,
                    success: function(w) {
                        v(w)
                    }
                })
            } else {
                Ext.Ajax.request({
                    url: t,
                    disableCaching: false,
                    success: function(w) {
                        v(Ext.decode(w.responseText))
                    },
                    failure: function() {
                        s()
                    }
                })
            }
        };
        l = function(q, s) {
            q = q || j.core.view;
            s = s || j.core.featureStore.features;
            for (var r = 0; r < s.length; r++) {
                s[r].attributes.value = 0;
                s[r].attributes.popupText = s[r].attributes.name
            }
            j.removeFeatures(j.features);
            j.addFeatures(s);
            h(q)
        };
        h = function(q) {
            q = q || j.core.view;
            for (var t = 0, s; t < j.features.length; t++) {
                attr = j.features[t].attributes;
                attr.label = q.labels ? attr.name : ""
            }
            var r = {
                indicator: p.conf.finals.widget.value,
                method: 2,
                numClasses: 5,
                colors: j.core.getColors("000000", "000000"),
                minSize: 6,
                maxSize: 6
            };
            j.core.view = q;
            j.core.applyClassification(r);
            p.util.layer.setFeatureLabelStyle(j, q.labels, false, q);
            o(q)
        };
        o = function(q) {
            if (j.item) {
                j.item.setValue(true, q.opacity)
            } else {
                j.setLayerOpacity(q.opacity)
            }
            if (n.updateGui && Ext.isObject(j.widget)) {
                j.widget.setGui(q)
            }
            if (n.zoomToVisibleExtent) {
                i.zoomToVisibleExtent()
            }
            if (n.hideMask) {
                i.mask.hide()
            }
            if (n.callBack) {
                n.callBack(j)
            } else {
                p.map = null;
                if (p.viewport.shareButton) {
                    p.viewport.shareButton.enable()
                }
            }
        };
        n = {
            compare: false,
            updateGui: false,
            zoomToVisibleExtent: false,
            hideMask: false,
            callBack: null,
            load: function(q) {
                p.olmap.mask.show();
                if (this.compare) {
                    k(q, true)
                } else {
                    m(q)
                }
            },
            loadData: l,
            loadLegend: h
        };
        return n
    };
    GIS.core.LayerLoaderThematic = function(q, j) {
        var i = j.map,
            k, m, l, h, p, n, o = q.conf.finals.dimension;
        k = function(t, w) {
            var y = j.core.view,
                x, s, r, u;
            n.zoomToVisibleExtent = true;
            if (!y) {
                if (w) {
                    m(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            x = [];
            s = t.rows[0];
            r = [];
            u = y.rows[0];
            if (s.items.length === u.items.length) {
                for (var v = 0; v < s.items.length; v++) {
                    x.push(s.items[v].id)
                }
                for (var v = 0; v < u.items.length; v++) {
                    r.push(u.items[v].id)
                }
                if (Ext.Array.difference(x, r).length !== 0) {
                    if (w) {
                        m(t)
                    }
                    return q.conf.finals.widget.loadtype_organisationunit
                }
            } else {
                if (w) {
                    m(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            n.zoomToVisibleExtent = false;
            x = [];
            s = t.columns[0];
            r = [];
            u = y.columns[0];
            if (s.items.length === u.items.length) {
                for (var v = 0; v < s.items.length; v++) {
                    x.push(s.items[v].id)
                }
                for (var v = 0; v < u.items.length; v++) {
                    r.push(u.items[v].id)
                }
                if (Ext.Array.difference(x, r).length !== 0) {
                    if (w) {
                        l(t)
                    }
                    return q.conf.finals.widget.loadtype_organisationunit
                }
            } else {
                if (w) {
                    l(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            x = [];
            s = t.filters[0];
            r = [];
            u = y.filters[0];
            if (s.items.length === u.items.length) {
                for (var v = 0; v < s.items.length; v++) {
                    x.push(s.items[v].id)
                }
                for (var v = 0; v < u.items.length; v++) {
                    r.push(u.items[v].id)
                }
                if (Ext.Array.difference(x, r).length !== 0) {
                    if (w) {
                        l(t)
                    }
                    return q.conf.finals.widget.loadtype_organisationunit
                }
            } else {
                if (w) {
                    l(t)
                }
                return q.conf.finals.widget.loadtype_organisationunit
            }
            if (w) {
                n.zoomToVisibleExtent = false;
                h(t);
                return q.conf.finals.widget.loadtype_legend
            }
        };
        m = function(r) {
            var s = r.rows[0].items,
                v = GIS.plugin && !GIS.app,
                u = function() {
                    var y = "?ou=ou:";
                    for (var x = 0; x < s.length; x++) {
                        y += s[x].id;
                        y += x !== s.length - 1 ? ";" : ""
                    }
                    y += "&displayProperty=" + q.init.userAccount.settings.keyAnalysisDisplayProperty.toUpperCase();
                    return q.init.contextPath + "/api/geoFeatures." + (v ? "jsonp" : "json") + y
                }(),
                w, t;
            w = function(z) {
                var x = q.util.geojson.decode(z),
                    A = new OpenLayers.Format.GeoJSON(),
                    y = q.util.map.getTransformedFeatureArray(A.read(x));
                if (!Ext.isArray(y)) {
                    i.mask.hide();
                    alert(GIS.i18n.invalid_coordinates);
                    return
                }
                if (!y.length) {
                    i.mask.hide();
                    alert(GIS.i18n.no_valid_coordinates_found);
                    return
                }
                j.core.featureStore.loadFeatures(y.slice(0));
                l(r, y)
            };
            t = function() {
                i.mask.hide();
                alert(GIS.i18n.coordinates_could_not_be_loaded)
            };
            if (v) {
                Ext.data.JsonP.request({
                    url: u,
                    disableCaching: false,
                    success: function(x) {
                        w(x)
                    }
                })
            } else {
                Ext.Ajax.request({
                    url: u,
                    disableCaching: false,
                    success: function(x) {
                        w(Ext.decode(x.responseText))
                    },
                    failure: function() {
                        t()
                    }
                })
            }
        };
        l = function(y, t) {
            var A;
            y = y || j.core.view;
            t = t || j.core.featureStore.features;
            var z = q.conf.finals.dimension,
                u = "?",
                v = y.columns[0].items,
                r = y.columns[0].dimension === z.operand.objectName,
                s = y.filters[0].items,
                x = y.rows[0].items;
            u += "dimension=ou:";
            for (var w = 0; w < x.length; w++) {
                u += x[w].id;
                u += w < x.length - 1 ? ";" : ""
            }
            u += "&dimension=dx:";
            for (var w = 0; w < v.length; w++) {
                u += r ? v[w].id.split(".")[0] : v[w].id;
                u += w < v.length - 1 ? ";" : ""
            }
            u += r ? "&dimension=co" : "";
            u += "&filter=pe:";
            for (var w = 0; w < s.length; w++) {
                u += s[w].id;
                u += w < s.length - 1 ? ";" : ""
            }
            u += "&displayProperty=" + q.init.userAccount.settings.keyAnalysisDisplayProperty.toUpperCase();
            A = function(N) {
                var G = q.api.response.Response(N),
                    L = {},
                    D = {},
                    I, F, K, E = [],
                    B, J = [];
                if (!G) {
                    i.mask.hide();
                    return
                }
                for (var H = 0; H < G.headers.length; H++) {
                    if (G.headers[H].name === z.organisationUnit.dimensionName) {
                        I = H
                    } else {
                        if (G.headers[H].name === z.value.dimensionName) {
                            K = H
                        }
                    }
                }
                for (var H = 0, C; H < t.length; H++) {
                    var C = t[H].attributes.id;
                    L[C] = true
                }
                for (var H = 0; H < G.rows.length; H++) {
                    var C = G.rows[H][I],
                        M = parseFloat(G.rows[H][K]);
                    D[C] = M
                }
                for (var H = 0; H < t.length; H++) {
                    var O = t[H],
                        C = O.attributes.id;
                    if (L.hasOwnProperty(C) && D.hasOwnProperty(C)) {
                        O.attributes.value = D[C];
                        O.attributes.popupText = O.attributes.name + " (" + O.attributes.value + ")";
                        E.push(O)
                    }
                }
                j.removeFeatures(j.features);
                j.addFeatures(E);
                q.response = G;
                h(y)
            };
            if (Ext.isObject(GIS.app)) {
                Ext.Ajax.request({
                    url: q.init.contextPath + "/api/analytics.json" + u,
                    disableCaching: false,
                    failure: function(B) {
                        alert(B.status + "\n" + B.statusText + "\n" + B.responseText)
                    },
                    success: function(B) {
                        A(Ext.decode(B.responseText))
                    }
                })
            } else {
                if (Ext.isObject(GIS.plugin)) {
                    Ext.data.JsonP.request({
                        url: q.init.contextPath + "/api/analytics.jsonp" + u,
                        disableCaching: false,
                        scope: this,
                        success: function(B) {
                            A(B)
                        }
                    })
                }
            }
        };
        h = function(x) {
            var r, y, w;
            x = x || j.core.view;
            for (var t = 0, z; t < j.features.length; t++) {
                attr = j.features[t].attributes;
                attr.label = x.labels ? attr.name + " (" + attr.value + ")" : ""
            }
            j.styleMap = GIS.core.StyleMap(x);
            y = function(D) {
                var B = Ext.Array.clean([].concat(x.columns || [], x.rows || [], x.filters || [])),
                    C = D.metaData,
                    I = C[o.period.objectName];
                for (var G = 0, E; G < B.length; G++) {
                    E = B[G];
                    for (var F = 0, H; F < E.items.length; F++) {
                        H = E.items[F];
                        if (H.id.indexOf(".") !== -1) {
                            var A = H.id.split(".");
                            H.name = C.names[A[0]] + " " + C.names[A[1]]
                        } else {
                            H.name = C.names[H.id]
                        }
                    }
                }
                x.filters[0].items[0].name = C.names[I[I.length - 1]]
            };
            w = function() {
                y(q.response);
                var A = {
                    indicator: q.conf.finals.widget.value,
                    method: x.legendSet ? mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS : x.method,
                    numClasses: x.classes,
                    bounds: r,
                    colors: j.core.getColors(x.colorLow, x.colorHigh),
                    minSize: x.radiusLow,
                    maxSize: x.radiusHigh
                };
                j.core.view = x;
                j.core.colorInterpolation = s;
                j.core.applyClassification(A);
                p(x)
            };
            if (x.legendSet) {
                var r = [],
                    s = [],
                    v = [],
                    u = [];
                Ext.Ajax.request({
                    url: q.init.contextPath + "/api/mapLegendSets/" + x.legendSet.id + ".json?fields=" + q.conf.url.mapLegendSetFields.join(","),
                    scope: this,
                    success: function(B) {
                        u = Ext.decode(B.responseText).mapLegends;
                        Ext.Array.sort(u, function(D, C) {
                            return D.startValue - C.startValue
                        });
                        for (var A = 0; A < u.length; A++) {
                            if (r[r.length - 1] !== u[A].startValue) {
                                if (r.length !== 0) {
                                    s.push(new mapfish.ColorRgb(240, 240, 240));
                                    v.push("")
                                }
                                r.push(u[A].startValue)
                            }
                            s.push(new mapfish.ColorRgb());
                            s[s.length - 1].setFromHex(u[A].color);
                            v.push(u[A].name);
                            r.push(u[A].endValue)
                        }
                        x.legendSet.names = v;
                        x.legendSet.bounds = r;
                        x.legendSet.colors = s;
                        w()
                    }
                })
            } else {
                w()
            }
        };
        p = function(r) {
            q.viewport.eastRegion.doLayout();
            j.legendPanel.expand();
            j.setLayerOpacity(r.opacity);
            if (j.item) {
                j.item.setValue(true)
            }
            if (j.filterWindow && j.filterWindow.isVisible()) {
                j.filterWindow.filter()
            }
            if (n.updateGui && Ext.isObject(j.widget)) {
                j.widget.setGui(r)
            }
            if (n.zoomToVisibleExtent) {
                i.zoomToVisibleExtent()
            }
            if (n.hideMask) {
                i.mask.hide()
            }
            if (n.callBack) {
                n.callBack(j)
            } else {
                q.map = null;
                if (q.viewport.shareButton) {
                    q.viewport.shareButton.enable()
                }
            }
            if (GIS.isSessionStorage) {
                q.util.layout.setSessionStorage("map", q.util.layout.getAnalytical())
            }
        };
        n = {
            compare: false,
            updateGui: false,
            zoomToVisibleExtent: false,
            hideMask: false,
            callBack: null,
            load: function(r) {
                q.olmap.mask.show();
                if (this.compare) {
                    k(r, true)
                } else {
                    m(r)
                }
            },
            loadData: l,
            loadLegend: h
        };
        return n
    };
    GIS.core.getInstance = function(n) {
        var k = {},
            i = {},
            l = {},
            j = {},
            m = [],
            h = {};
        (function() {
            k.finals = {
                url: {
                    path_commons: "/dhis-web-commons-ajax-json/"
                },
                layer: {
                    type_base: "base",
                    type_vector: "vector",
                    category_thematic: "thematic"
                },
                dimension: {
                    data: {
                        id: "data",
                        value: "data",
                        param: "dx",
                        dimensionName: "dx",
                        objectName: "dx"
                    },
                    category: {
                        name: GIS.i18n.categories,
                        dimensionName: "co",
                        objectName: "co"
                    },
                    indicator: {
                        id: "indicator",
                        value: "indicators",
                        param: "in",
                        dimensionName: "dx",
                        objectName: "in"
                    },
                    dataElement: {
                        id: "dataElement",
                        value: "dataElement",
                        param: "de",
                        dimensionName: "dx",
                        objectName: "de"
                    },
                    operand: {
                        id: "operand",
                        value: "operand",
                        param: "dc",
                        dimensionName: "dx",
                        objectName: "dc"
                    },
                    dataSet: {
                        value: "dataSets",
                        dimensionName: "dx",
                        objectName: "ds"
                    },
                    period: {
                        id: "period",
                        value: "period",
                        param: "pe",
                        dimensionName: "pe",
                        objectName: "pe"
                    },
                    organisationUnit: {
                        id: "organisationUnit",
                        value: "organisationUnit",
                        param: "ou",
                        dimensionName: "ou",
                        objectName: "ou"
                    },
                    value: {
                        id: "value",
                        value: "value",
                        param: "value",
                        dimensionName: "value",
                        objectName: "value"
                    }
                },
                widget: {
                    value: "value",
                    legendtype_automatic: "automatic",
                    legendtype_predefined: "predefined",
                    symbolizer_color: "color",
                    symbolizer_image: "image",
                    loadtype_organisationunit: "organisationUnit",
                    loadtype_data: "data",
                    loadtype_legend: "legend"
                },
                openLayers: {
                    point_classname: "OpenLayers.Geometry.Point"
                },
                mapfish: {
                    classify_with_bounds: 1,
                    classify_by_equal_intervals: 2,
                    classify_by_quantils: 3
                },
                root: {
                    id: "root"
                }
            };
            k.layout = {
                widget: {
                    item_width: 288,
                    itemlabel_width: 95,
                    window_width: 306
                },
                tool: {
                    item_width: 228,
                    itemlabel_width: 95,
                    window_width: 250
                },
                grid: {
                    row_height: 27
                },
                layer: {
                    opacity: 0.8
                }
            };
            k.period = {
                periodTypes: [{
                    id: "relativePeriods",
                    name: GIS.i18n.relative
                }, {
                    id: "Daily",
                    name: GIS.i18n.daily
                }, {
                    id: "Weekly",
                    name: GIS.i18n.weekly
                }, {
                    id: "Monthly",
                    name: GIS.i18n.monthly
                }, {
                    id: "BiMonthly",
                    name: GIS.i18n.bimonthly
                }, {
                    id: "Quarterly",
                    name: GIS.i18n.quarterly
                }, {
                    id: "SixMonthly",
                    name: GIS.i18n.sixmonthly
                }, {
                    id: "SixMonthlyApril",
                    name: GIS.i18n.sixmonthly_april
                }, {
                    id: "Yearly",
                    name: GIS.i18n.yearly
                }, {
                    id: "FinancialOct",
                    name: GIS.i18n.financial_oct
                }, {
                    id: "FinancialJuly",
                    name: GIS.i18n.financial_july
                }, {
                    id: "FinancialApril",
                    name: GIS.i18n.financial_april
                }],
                relativePeriods: [{
                    id: "LAST_WEEK",
                    name: GIS.i18n.last_week
                }, {
                    id: "LAST_MONTH",
                    name: GIS.i18n.last_month
                }, {
                    id: "LAST_BIMONTH",
                    name: GIS.i18n.last_bimonth
                }, {
                    id: "LAST_QUARTER",
                    name: GIS.i18n.last_quarter
                }, {
                    id: "LAST_SIX_MONTH",
                    name: GIS.i18n.last_sixmonth
                }, {
                    id: "LAST_FINANCIAL_YEAR",
                    name: GIS.i18n.last_financial_year
                }, {
                    id: "THIS_YEAR",
                    name: GIS.i18n.this_year
                }, {
                    id: "LAST_YEAR",
                    name: GIS.i18n.last_year
                }],
                relativePeriodsMap: {
                    LAST_WEEK: {
                        id: "LAST_WEEK",
                        name: GIS.i18n.last_week
                    },
                    LAST_MONTH: {
                        id: "LAST_MONTH",
                        name: GIS.i18n.last_month
                    },
                    LAST_BIMONTH: {
                        id: "LAST_BIMONTH",
                        name: GIS.i18n.last_bimonth
                    },
                    LAST_QUARTER: {
                        id: "LAST_QUARTER",
                        name: GIS.i18n.last_quarter
                    },
                    LAST_SIX_MONTH: {
                        id: "LAST_SIX_MONTH",
                        name: GIS.i18n.last_sixmonth
                    },
                    LAST_FINANCIAL_YEAR: {
                        id: "LAST_FINANCIAL_YEAR",
                        name: GIS.i18n.last_financial_year
                    },
                    THIS_YEAR: {
                        id: "THIS_YEAR",
                        name: GIS.i18n.this_year
                    },
                    LAST_YEAR: {
                        id: "LAST_YEAR",
                        name: GIS.i18n.last_year
                    }
                },
                integratedRelativePeriodsMap: {
                    LAST_WEEK: "LAST_WEEK",
                    LAST_4_WEEKS: "LAST_WEEK",
                    LAST_12_WEEKS: "LAST_WEEK",
                    LAST_MONTH: "LAST_MONTH",
                    LAST_3_MONTHS: "LAST_MONTH",
                    LAST_12_MONTHS: "LAST_MONTH",
                    LAST_BIMONTH: "LAST_BIMONTH",
                    LAST_6_BIMONTHS: "LAST_BIMONTH",
                    LAST_QUARTER: "LAST_QUARTER",
                    LAST_4_QUARTERS: "LAST_QUARTER",
                    LAST_SIX_MONTH: "LAST_SIX_MONTH",
                    LAST_2_SIXMONTHS: "LAST_SIX_MONTH",
                    LAST_FINANCIAL_YEAR: "LAST_FINANCIAL_YEAR",
                    LAST_5_FINANCIAL_YEARS: "LAST_FINANCIAL_YEAR",
                    THIS_YEAR: "THIS_YEAR",
                    LAST_YEAR: "LAST_YEAR",
                    LAST_5_YEARS: "LAST_YEAR"
                }
            };
            k.url = {};
            k.url.analysisFields = ["*", "columns[dimension,filter,items[id," + n.namePropertyUrl + "]]", "rows[dimension,filter,items[id," + n.namePropertyUrl + "]]", "filters[dimension,filter,items[id," + n.namePropertyUrl + "]]", "!lastUpdated", "!href", "!created", "!publicAccess", "!rewindRelativePeriods", "!userOrganisationUnit", "!userOrganisationUnitChildren", "!userOrganisationUnitGrandChildren", "!externalAccess", "!access", "!relativePeriods", "!columnDimensions", "!rowDimensions", "!filterDimensions", "!user", "!organisationUnitGroups", "!itemOrganisationUnitGroups", "!userGroupAccesses", "!indicators", "!dataElements", "!dataElementOperands", "!dataElementGroups", "!dataSets", "!periods", "!organisationUnitLevels", "!organisationUnits", "!sortOrder", "!topLimit"];
            k.url.mapFields = [k.url.analysisFields.join(","), "mapViews[" + k.url.analysisFields.join(",") + "]"];
            k.url.mapLegendFields = ["*", "!created", "!lastUpdated", "!displayName", "!externalAccess", "!access", "!userGroupAccesses"];
            k.url.mapLegendSetFields = ["id,name,mapLegends[" + k.url.mapLegendFields.join(",") + "]"]
        }());
        (function() {
            i.map = {};
            i.map.getVisibleVectorLayers = function() {
                var q = [];
                for (var p = 0, o; p < h.olmap.layers.length; p++) {
                    o = h.olmap.layers[p];
                    if (o.layerType === k.finals.layer.type_vector && o.visibility && o.features.length) {
                        q.push(o)
                    }
                }
                return q
            };
            i.map.getRenderedVectorLayers = function() {
                var q = [];
                for (var p = 0, o; p < h.olmap.layers.length; p++) {
                    o = h.olmap.layers[p];
                    if (o.layerType === k.finals.layer.type_vector && o.features.length) {
                        q.push(o)
                    }
                }
                return q
            };
            i.map.getExtendedBounds = function(q) {
                var p = null;
                if (q.length) {
                    p = q[0].getDataExtent();
                    if (q.length > 1) {
                        for (var o = 1; o < q.length; o++) {
                            p.extend(q[o].getDataExtent())
                        }
                    }
                }
                return p
            };
            i.map.zoomToVisibleExtent = function(p) {
                var o = i.map.getExtendedBounds(i.map.getVisibleVectorLayers(p));
                if (o) {
                    p.zoomToExtent(o)
                }
            };
            i.map.getTransformedFeatureArray = function(r) {
                var o = new OpenLayers.Projection("EPSG:4326"),
                    p = new OpenLayers.Projection("EPSG:900913");
                for (var q = 0; q < r.length; q++) {
                    r[q].geometry.transform(o, p)
                }
                return r
            };
            i.geojson = {};
            i.geojson.decode = function(u, v) {
                var q = {
                    type: "FeatureCollection",
                    crs: {
                        type: "EPSG",
                        properties: {
                            code: "4326"
                        }
                    },
                    features: []
                };
                v = v || "ASC";
                u = i.array.sort(u, v, "le");
                for (var r = 0, t, p = "", o = ""; r < u.length; r++) {
                    t = u[r];
                    if (Ext.isString(t.pg) && t.pg.length) {
                        var s = Ext.Array.clean(t.pg.split("/"));
                        if (s.length >= 2) {
                            p = s[s.length - 2]
                        }
                        if (s.length > 2) {
                            o = "/" + s.slice(0, s.length - 2).join("/")
                        }
                    }
                    q.features.push({
                        type: "Feature",
                        geometry: {
                            type: parseInt(t.ty) === 1 ? "Point" : "MultiPolygon",
                            coordinates: JSON.parse(t.co)
                        },
                        properties: {
                            id: t.id,
                            name: t.na,
                            hasCoordinatesDown: t.hcd,
                            hasCoordinatesUp: t.hcu,
                            level: t.le,
                            grandParentParentGraph: o,
                            grandParentId: p,
                            parentGraph: t.pg,
                            parentId: t.pi,
                            parentName: t.pn
                        }
                    })
                }
                return q
            };
            i.gui = {};
            i.gui.combo = {};
            i.gui.combo.setQueryMode = function(o, q) {
                for (var p = 0; p < o.length; p++) {
                    o[p].queryMode = q
                }
            };
            i.object = {};
            i.object.getLength = function(o) {
                var q = 0;
                for (var p in o) {
                    if (o.hasOwnProperty(p)) {
                        q++
                    }
                }
                return q
            };
            i.array = {};
            i.array.sort = function(q, p, o) {
                if (!i.object.getLength(q)) {
                    return q
                }
                o = o || "name";
                q.sort(function(s, r) {
                    if (Ext.isObject(s) && Ext.isObject(r) && o) {
                        s = s[o];
                        r = r[o]
                    }
                    if (Ext.isString(s) && Ext.isString(r)) {
                        s = s.toLowerCase();
                        r = r.toLowerCase();
                        if (p === "DESC") {
                            return s < r ? 1 : (s > r ? -1 : 0)
                        } else {
                            return s < r ? -1 : (s > r ? 1 : 0)
                        }
                    } else {
                        if (Ext.isNumber(s) && Ext.isNumber(r)) {
                            return p === "DESC" ? r - s : s - r
                        }
                    }
                    return 0
                });
                return q
            };
            i.layout = {};
            i.layout.getAnalytical = function(t) {
                var s, r;
                if (Ext.isObject(t) && Ext.isArray(t.mapViews) && t.mapViews.length) {
                    for (var q = 0, o, u; q < t.mapViews.length; q++) {
                        o = t.mapViews[q];
                        u = o.layer;
                        if (h.layer.hasOwnProperty(u) && h.layer[u].layerCategory === h.conf.finals.layer.category_thematic) {
                            s = h.api.layout.Layout(o);
                            if (s) {
                                return s
                            }
                        }
                    }
                } else {
                    for (var p in h.layer) {
                        if (h.layer.hasOwnProperty(p) && h.layer[p].layerCategory === h.conf.finals.layer.category_thematic && h.layer[p].core.view) {
                            r = h.layer[p];
                            s = h.api.layout.Layout(r.core.view);
                            if (s) {
                                if (!s.parentGraphMap && r.widget) {
                                    s.parentGraphMap = r.widget.getParentGraphMap()
                                }
                                return s
                            }
                        }
                    }
                }
                return
            };
            i.layout.getPluginConfig = function() {
                var r = h.util.map.getVisibleVectorLayers(),
                    q = {};
                if (h.map) {
                    return h.map
                }
                q.mapViews = [];
                for (var p = 0, o; p < r.length; p++) {
                    o = r[p];
                    if (o.core.view) {
                        o.core.view.layer = o.id;
                        q.mapViews.push(o.core.view)
                    }
                }
                return q
            };
            i.layout.setSessionStorage = function(r, q, p) {
                if (GIS.isSessionStorage) {
                    var o = JSON.parse(sessionStorage.getItem("dhis2")) || {};
                    o[r] = q;
                    sessionStorage.setItem("dhis2", JSON.stringify(o));
                    if (Ext.isString(p)) {
                        window.location.href = p
                    }
                }
            };
            i.layout.getDataDimensionsFromLayout = function(s) {
                var r = Ext.Array.clean([].concat(s.columns || [], s.rows || [], s.filters || [])),
                    q = ["pe", "ou"],
                    o = [];
                for (var p = 0; p < r.length; p++) {
                    if (!Ext.Array.contains(q, r[p].dimension)) {
                        o.push(r[p])
                    }
                }
                return o
            };
            i.layer = {};
            i.layer.setFeatureLabelStyle = function(s, u, v, o) {
                for (var r = 0, q, t, p; r < s.features.length; r++) {
                    q = s.features[r];
                    t = q.style;
                    if (u) {
                        t.label = q.attributes.label;
                        t.fontColor = t.strokeColor;
                        t.fontWeight = t.strokeWidth > 1 ? "bold" : "normal";
                        t.labelAlign = "cr";
                        t.labelYOffset = 13;
                        if (o.labelFontSize) {
                            t.fontSize = o.labelFontSize
                        }
                        if (o.labelFontStyle) {
                            t.fontStyle = o.labelFontStyle
                        }
                    } else {
                        t.label = null
                    }
                }
                if (!v) {
                    s.redraw()
                }
            }
        }());
        h.init = n;
        h.conf = k;
        h.util = i;
        (function() {
            var o = h.conf.finals.dimension;
            l.layout = {};
            l.response = {};
            l.layout.Record = function(q) {
                var p = {};
                return function() {
                    if (!Ext.isObject(q)) {
                        console.log("Record config is not an object", q);
                        return
                    }
                    if (!Ext.isString(q.id)) {
                        console.log("Record id is not text", q);
                        return
                    }
                    p.id = q.id.replace("#", ".");
                    if (Ext.isString(q.name)) {
                        p.name = q.name
                    }
                    return Ext.clone(p)
                }()
            };
            l.layout.Dimension = function(p) {
                var q = {};
                return function() {
                    if (!Ext.isObject(p)) {
                        return
                    }
                    if (!Ext.isString(p.dimension)) {
                        console.log("Dimension name is not text", p);
                        return
                    }
                    if (p.dimension !== k.finals.dimension.category.objectName) {
                        var r = [];
                        if (!Ext.isArray(p.items)) {
                            console.log("Dimension items is not an array", p);
                            return
                        }
                        for (var s = 0; s < p.items.length; s++) {
                            record = l.layout.Record(p.items[s]);
                            if (record) {
                                r.push(record)
                            }
                        }
                        p.items = r;
                        if (!p.items.length) {
                            console.log("Dimension has no valid items", p);
                            return
                        }
                    }
                    q.dimension = p.dimension;
                    q.items = p.items;
                    return Ext.clone(q)
                }()
            };
            l.layout.Layout = function(q) {
                var q = Ext.clone(q),
                    r = {},
                    p, s;
                p = function(w) {
                    var u = [];
                    if (!(w && Ext.isArray(w) && w.length)) {
                        return
                    }
                    for (var t = 0, v; t < w.length; t++) {
                        v = l.layout.Dimension(w[t]);
                        if (v) {
                            u.push(v)
                        }
                    }
                    w = u;
                    return w.length ? w : null
                };
                s = function(v) {
                    var x = Ext.Array.clean([].concat(v.columns || [], v.rows || [], v.filters || [])),
                        z = k.period.integratedRelativePeriodsMap,
                        u, A, t;
                    for (var w = 0, y; w < x.length; w++) {
                        y = x[w];
                        if (y.dimension === o.indicator.objectName || y.dimension === o.dataElement.objectName || y.dimension === o.operand.objectName || y.dimension === o.dataSet.objectName) {
                            u = y
                        } else {
                            if (y.dimension === o.period.objectName) {
                                A = y
                            } else {
                                if (y.dimension === o.organisationUnit.objectName) {
                                    t = y
                                }
                            }
                        }
                    }
                    if (!t) {
                        alert("No organisation units specified");
                        return
                    }
                    if (u) {
                        u.items = [u.items[0]]
                    }
                    if (A) {
                        A.items = [A.items[0]];
                        A.items[0].id = z[A.items[0].id] ? z[A.items[0].id] : A.items[0].id
                    }
                    v.columns = [u];
                    v.rows = [t];
                    v.filters = [A];
                    return v
                };
                return function() {
                    var z = [],
                        y = [],
                        B = k.finals.dimension,
                        u = isOu = false,
                        t = false,
                        C = false;
                    q = s(q);
                    if (!q) {
                        return
                    }
                    q.columns = p(q.columns);
                    q.rows = p(q.rows);
                    q.filters = p(q.filters);
                    if (!q.rows) {
                        console.log("Organisation unit dimension is invalid", q.rows);
                        return
                    }
                    if (Ext.Array.contains([h.layer.thematic1.id, h.layer.thematic2.id, h.layer.thematic3.id, h.layer.thematic4.id], q.layer)) {
                        if (!q.columns) {
                            return
                        }
                    }
                    for (var w = 0, x, A = Ext.Array.clean([].concat(q.columns, q.rows, q.filters)); w < A.length; w++) {
                        x = A[w];
                        if (x) {
                            if (Ext.isString(x.dimension)) {
                                y.push(x.dimension)
                            }
                            if (x.dimension === B.organisationUnit.objectName && Ext.isArray(x.items)) {
                                for (var v = 0; v < x.items.length; v++) {
                                    if (x.items[v].id === "USER_ORGUNIT") {
                                        isOu = true
                                    } else {
                                        if (x.items[v].id === "USER_ORGUNIT_CHILDREN") {
                                            t = true
                                        } else {
                                            if (x.items[v].id === "USER_ORGUNIT_GRANDCHILDREN") {
                                                C = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    r.columns = q.columns;
                    r.rows = q.rows;
                    r.filters = q.filters;
                    r.layer = Ext.isString(q.layer) && !Ext.isEmpty(q.layer) ? q.layer : "thematic1";
                    r.classes = Ext.isNumber(q.classes) && !Ext.isEmpty(q.classes) ? q.classes : 5;
                    r.method = Ext.isNumber(q.method) && !Ext.isEmpty(q.method) ? q.method : 2;
                    r.colorLow = Ext.isString(q.colorLow) && !Ext.isEmpty(q.colorLow) ? q.colorLow : "ff0000";
                    r.colorHigh = Ext.isString(q.colorHigh) && !Ext.isEmpty(q.colorHigh) ? q.colorHigh : "00ff00";
                    r.radiusLow = Ext.isNumber(q.radiusLow) && !Ext.isEmpty(q.radiusLow) ? q.radiusLow : 5;
                    r.radiusHigh = Ext.isNumber(q.radiusHigh) && !Ext.isEmpty(q.radiusHigh) ? q.radiusHigh : 15;
                    r.opacity = Ext.isNumber(q.opacity) && !Ext.isEmpty(q.opacity) ? q.opacity : h.conf.layout.layer.opacity;
                    r.areaRadius = q.areaRadius;
                    r.labels = !!q.labels;
                    r.labelFontSize = q.labelFontSize || "11px";
                    r.labelFontSize = parseInt(r.labelFontSize) + "px";
                    r.labelFontWeight = Ext.isString(q.labelFontWeight) || Ext.isNumber(q.labelFontWeight) ? q.labelFontWeight : "normal";
                    r.labelFontWeight = Ext.Array.contains(["normal", "bold", "bolder", "lighter"], r.labelFontWeight) ? r.labelFontWeight : "normal";
                    r.labelFontWeight = Ext.isNumber(parseInt(r.labelFontWeight)) && parseInt(r.labelFontWeight) <= 1000 ? r.labelFontWeight.toString() : r.labelFontWeight;
                    r.labelFontStyle = Ext.Array.contains(["normal", "italic", "oblique"], q.labelFontStyle) ? q.labelFontStyle : "normal";
                    r.labelFontColor = Ext.isString(q.labelFontColor) || Ext.isNumber(q.labelFontColor) ? q.labelFontColor : "normal";
                    r.labelFontColor = Ext.isNumber(r.labelFontColor) ? r.labelFontColor.toString() : r.labelFontColor;
                    r.labelFontColor = r.labelFontColor.charAt(0) !== "#" ? "#" + r.labelFontColor : r.labelFontColor;
                    r.hidden = !!q.hidden;
                    r.userOrganisationUnit = isOu;
                    r.userOrganisationUnitChildren = t;
                    r.userOrganisationUnitGrandChildren = C;
                    r.parentGraphMap = Ext.isObject(q.parentGraphMap) ? q.parentGraphMap : null;
                    r.legendSet = q.legendSet;
                    r.organisationUnitGroupSet = q.organisationUnitGroupSet;
                    return r
                }()
            };
            l.response.Header = function(p) {
                var q = {};
                return function() {
                    if (!Ext.isObject(p)) {
                        console.log("Header is not an object", p);
                        return
                    }
                    if (!Ext.isString(p.name)) {
                        console.log("Header name is not text", p);
                        return
                    }
                    if (!Ext.isBoolean(p.meta)) {
                        console.log("Header meta is not boolean", p);
                        return
                    }
                    q.name = p.name;
                    q.meta = p.meta;
                    return Ext.clone(q)
                }()
            };
            l.response.Response = function(q) {
                var p = {};
                return function() {
                    var s = [];
                    if (!(q && Ext.isObject(q))) {
                        alert("Data response invalid", q);
                        return false
                    }
                    if (!(q.headers && Ext.isArray(q.headers))) {
                        alert("Data response invalid", q);
                        return false
                    }
                    for (var r = 0, t; r < q.headers.length; r++) {
                        t = l.response.Header(q.headers[r]);
                        if (t) {
                            s.push(t)
                        }
                    }
                    q.headers = s;
                    if (!q.headers.length) {
                        alert("No valid response headers", q);
                        return
                    }
                    if (!(Ext.isArray(q.rows) && q.rows.length > 0)) {
                        alert("No values found", q);
                        return false
                    }
                    if (q.headers.length !== q.rows[0].length) {
                        alert("Data invalid", q);
                        return false
                    }
                    p.headers = q.headers;
                    p.metaData = q.metaData;
                    p.width = q.width;
                    p.height = q.height;
                    p.rows = q.rows;
                    return p
                }()
            }
        }());
        h.api = l;
        h.store = j;
        h.olmap = GIS.core.getOLMap(h);
        h.layer = GIS.core.getLayers(h);
        h.thematicLayers = [h.layer.thematic1, h.layer.thematic2, h.layer.thematic3, h.layer.thematic4];
        if (window.google) {
            m.push(h.layer.googleStreets, h.layer.googleHybrid)
        }
        m.push(h.layer.openStreetMap, h.layer.thematic4, h.layer.thematic3, h.layer.thematic2, h.layer.thematic1, h.layer.boundary, h.layer.facility, h.layer.event);
        h.olmap.addLayers(m);
        GIS.core.instances.push(h);
        return h
    };
    (function() {
        window.mapfish = {
            _scriptName: "MapFish.js",
            _getScriptLocation: function() {
                if (window.gMfLocation) {
                    return window.gMfLocation
                }
                var s = "";
                var t = mapfish._scriptName;
                var h = document.getElementsByTagName("script");
                for (var r = 0; r < h.length; r++) {
                    var u = h[r].getAttribute("src");
                    if (u) {
                        var q = u.lastIndexOf(t);
                        if ((q > -1) && (q + t.length == u.length)) {
                            s = u.slice(0, -t.length);
                            break
                        }
                    }
                }
                return s
            }
        };
        var o = new Array("core/Color.js", "core/GeoStat.js", "core/GeoStat/Boundary.js", "core/GeoStat/Thematic1.js", "core/GeoStat/Thematic2.js", "core/GeoStat/Facility.js", "core/GeoStat/Symbol.js", "core/Util.js");
        var p = "";
        var n = mapfish._getScriptLocation();
        for (var j = 0; j < o.length; j++) {
            if (/MSIE/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
                var m = "<script src='" + n + o[j] + "'><\/script>";
                p += m
            } else {
                var l = document.createElement("script");
                l.src = n + o[j];
                var k = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body;
                k.appendChild(l)
            }
        }
        if (p) {}
        mapfish.Color = OpenLayers.Class({
            getColorRgb: function() {}
        });
        mapfish.ColorRgb = OpenLayers.Class(mapfish.Color, {
            redLevel: null,
            greenLevel: null,
            blueLevel: null,
            initialize: function(q, i, h) {
                this.redLevel = q;
                this.greenLevel = i;
                this.blueLevel = h
            },
            equals: function(h) {
                return h.redLevel == this.redLevel && h.greenLevel == this.greenLevel && h.blueLevel == this.blueLevel
            },
            getColorRgb: function() {
                return this
            },
            getRgbArray: function() {
                return [this.redLevel, this.greenLevel, this.blueLevel]
            },
            hex2rgbArray: function(h) {
                if (h.charAt(0) == "#") {
                    h = h.substr(1)
                }
                var q = [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
                for (var r = 0; r < q.length; r++) {
                    if (q[r] < 0 || q[r] > 255) {
                        OpenLayers.Console.error("Invalid rgb hex color string: rgbHexString")
                    }
                }
                return q
            },
            setFromHex: function(h) {
                var i = this.hex2rgbArray(h);
                this.redLevel = i[0];
                this.greenLevel = i[1];
                this.blueLevel = i[2]
            },
            setFromRgb: function(i) {
                var h = dojo.colorFromString(i);
                this.redLevel = h.r;
                this.greenLevel = h.g;
                this.blueLevel = h.b
            },
            toHexString: function() {
                var q = this.toHex(this.redLevel);
                var i = this.toHex(this.greenLevel);
                var h = this.toHex(this.blueLevel);
                return "#" + q + i + h
            },
            toHex: function(t) {
                var q = "0123456789ABCDEF";
                if (t < 0 || t > 255) {
                    var s = "Invalid decimal value for color level";
                    OpenLayers.Console.error(s)
                }
                var r = Math.floor(t / 16);
                var h = t % 16;
                return q.charAt(r) + q.charAt(h)
            },
            CLASS_NAME: "mapfish.ColorRgb"
        });
        mapfish.ColorRgb.getColorsArrayByRgbInterpolation = function(x, s, u) {
            var y = [];
            var q = x.getColorRgb();
            var h = s.getColorRgb();
            var w = q.getRgbArray();
            var v = h.getRgbArray();
            if (u == 1) {
                return [q]
            }
            for (var t = 0; t < u; t++) {
                var r = [];
                r[0] = w[0] + t * (v[0] - w[0]) / (u - 1);
                r[1] = w[1] + t * (v[1] - w[1]) / (u - 1);
                r[2] = w[2] + t * (v[2] - w[2]) / (u - 1);
                y[t] = new mapfish.ColorRgb(parseInt(r[0]), parseInt(r[1]), parseInt(r[2]))
            }
            return y
        };
        mapfish.Util = {};
        mapfish.Util.sum = function(r) {
            for (var h = 0, q = 0; h < r.length; q += r[h++]) {}
            return q
        };
        mapfish.Util.max = function(h) {
            return Math.max.apply({}, h)
        };
        mapfish.Util.min = function(h) {
            return Math.min.apply({}, h)
        };
        mapfish.Util.getIconUrl = function(i, h) {
            if (!h.layer) {
                OpenLayers.Console.warn("Missing required layer option in mapfish.Util.getIconUrl");
                return ""
            }
            if (!h.rule) {
                h.rule = h.layer
            }
            if (i.indexOf("?") < 0) {
                i += "?"
            } else {
                if (i.lastIndexOf("&") != (i.length - 1)) {
                    if (i.indexOf("?") != (i.length - 1)) {
                        i += "&"
                    }
                }
            }
            var h = OpenLayers.Util.extend({
                layer: "",
                rule: "",
                service: "WMS",
                version: "1.1.1",
                request: "GetLegendGraphic",
                format: "image/png",
                width: 16,
                height: 16
            }, h);
            h = OpenLayers.Util.upperCaseObject(h);
            return i + OpenLayers.Util.getParameterString(h)
        };
        mapfish.Util.arrayEqual = function(q, h) {
            if (q == null || h == null) {
                return false
            }
            if (typeof(q) != "object" || typeof(h) != "object") {
                return false
            }
            if (q.length != h.length) {
                return false
            }
            for (var r = 0; r < q.length; r++) {
                if (typeof(q[r]) != typeof(h[r])) {
                    return false
                }
                if (q[r] != h[r]) {
                    return false
                }
            }
            return true
        };
        mapfish.Util.isIE7 = function() {
            var h = navigator.userAgent.toLowerCase();
            return h.indexOf("msie 7") > -1
        };
        mapfish.Util.relativeToAbsoluteURL = function(q) {
            if (/^\w+:/.test(q) || !q) {
                return q
            }
            var i = location.protocol + "//" + location.host;
            if (q.indexOf("/") == 0) {
                return i + q
            }
            var r = location.pathname.replace(/\/[^\/]*$/, "");
            return i + r + "/" + q
        };
        mapfish.Util.fixArray = function(h) {
            if (h == "" || h == null) {
                return []
            } else {
                if (h instanceof Array) {
                    return h
                } else {
                    return h.split(",")
                }
            }
        };
        mapfish.GeoStat = OpenLayers.Class({
            layer: null,
            format: null,
            url: null,
            requestSuccess: function(h) {},
            requestFailure: function(h) {},
            indicator: null,
            defaultSymbolizer: {},
            legendDiv: null,
            initialize: function(q, h) {
                this.map = q;
                this.addOptions(h);
                if (!this.layer) {
                    var i = new OpenLayers.Layer.Vector("geostat", {
                        displayInLayerSwitcher: false,
                        visibility: false
                    });
                    q.addLayer(i);
                    this.layer = i
                }
                this.setUrl(this.url);
                this.legendDiv = Ext.get(h.legendDiv)
            },
            setUrl: function(h) {
                this.url = h;
                if (this.url) {
                    OpenLayers.Request.GET({
                        url: this.url,
                        scope: this,
                        success: this.requestSuccess,
                        failure: this.requestFailure
                    })
                }
            },
            getColors: function(h, q) {
                var r = new mapfish.ColorRgb(),
                    i = new mapfish.ColorRgb();
                r.setFromHex(h);
                i.setFromHex(q);
                return [r, i]
            },
            addOptions: function(h) {
                if (h) {
                    if (!this.options) {
                        this.options = {}
                    }
                    OpenLayers.Util.extend(this.options, h);
                    OpenLayers.Util.extend(this, h)
                }
            },
            extendStyle: function(r, q, h) {
                var i = this.layer.styleMap.styles["default"];
                if (r) {
                    i.rules = r
                }
                if (q) {
                    i.setDefaultStyle(OpenLayers.Util.applyDefaults(q, i.defaultStyle))
                }
                if (h) {
                    if (!i.context) {
                        i.context = {}
                    }
                    OpenLayers.Util.extend(i.context, h)
                }
            },
            applyClassification: function(h) {
                this.layer.renderer.clear();
                this.layer.redraw();
                this.updateLegend();
                this.layer.setVisibility(true)
            },
            showDetails: function(h) {},
            hideDetails: function(h) {},
            CLASS_NAME: "mapfish.GeoStat"
        });
        mapfish.GeoStat.Distribution = OpenLayers.Class({
            labelGenerator: function(i, r, s) {
                var h = parseFloat(i.lowerBound).toFixed(1),
                    q = parseFloat(i.upperBound).toFixed(1);
                return h + " - " + q + "&nbsp;&nbsp;(" + i.nbVal + ")"
            },
            values: null,
            nbVal: null,
            minVal: null,
            maxVal: null,
            initialize: function(h, i) {
                OpenLayers.Util.extend(this, i);
                this.values = h;
                this.nbVal = h.length;
                this.minVal = this.nbVal ? mapfish.Util.min(this.values) : 0;
                this.maxVal = this.nbVal ? mapfish.Util.max(this.values) : 0
            },
            classifyWithBounds: function(h) {
                var y = [];
                var v = [];
                var x = [];
                for (var u = 0; u < this.values.length; u++) {
                    x.push(this.values[u])
                }
                x.sort(function(z, i) {
                    return z - i
                });
                var w = h.length - 1;
                for (var t = 0; t < w; t++) {
                    v[t] = 0
                }
                for (var s = 0; s < w - 1; s) {
                    if (x[0] < h[s + 1]) {
                        v[s] = v[s] + 1;
                        x.shift()
                    } else {
                        s++
                    }
                }
                v[w - 1] = this.nbVal - mapfish.Util.sum(v);
                for (var r = 0; r < w; r++) {
                    y[r] = new mapfish.GeoStat.Bin(v[r], h[r], h[r + 1], r == (w - 1));
                    var q = this.labelGenerator || this.defaultLabelGenerator;
                    y[r].label = q(y[r], r, w)
                }
                return new mapfish.GeoStat.Classification(y)
            },
            classifyByEqIntervals: function(r) {
                var q = [];
                for (var h = 0; h <= r; h++) {
                    q[h] = this.minVal + h * (this.maxVal - this.minVal) / r
                }
                return this.classifyWithBounds(q)
            },
            classifyByQuantils: function(t) {
                var h = this.values;
                h.sort(function(v, u) {
                    return v - u
                });
                var s = Math.round(this.values.length / t);
                var r = [];
                var q = (s === 0) ? 0 : s;
                if (h.length > 0) {
                    r[0] = h[0];
                    for (j = 1; j < t; j++) {
                        r[j] = h[q];
                        q += s
                    }
                    r.push(h[h.length - 1])
                }
                for (var i = 0; i < r.length; i++) {
                    r[i] = parseFloat(r[i])
                }
                return this.classifyWithBounds(r)
            },
            sturgesRule: function() {
                return Math.floor(1 + 3.3 * Math.log(this.nbVal, 10))
            },
            classify: function(r, q, h) {
                var i = null;
                if (!q) {
                    q = this.sturgesRule()
                }
                switch (parseFloat(r)) {
                    case mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS:
                        i = this.classifyWithBounds(h);
                        break;
                    case mapfish.GeoStat.Distribution.CLASSIFY_BY_EQUAL_INTERVALS:
                        i = this.classifyByEqIntervals(q);
                        break;
                    case mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS:
                        i = this.classifyByQuantils(q);
                        break;
                    default:
                        OpenLayers.Console.error("Unsupported or invalid classification method")
                }
                return i
            },
            CLASS_NAME: "mapfish.GeoStat.Distribution"
        });
        mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS = 1;
        mapfish.GeoStat.Distribution.CLASSIFY_BY_EQUAL_INTERVALS = 2;
        mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS = 3;
        mapfish.GeoStat.Bin = OpenLayers.Class({
            label: null,
            nbVal: null,
            lowerBound: null,
            upperBound: null,
            isLast: false,
            initialize: function(q, r, i, h) {
                this.nbVal = q;
                this.lowerBound = r;
                this.upperBound = i;
                this.isLast = h
            },
            CLASS_NAME: "mapfish.GeoStat.Bin"
        });
        mapfish.GeoStat.Classification = OpenLayers.Class({
            bins: [],
            initialize: function(h) {
                this.bins = h
            },
            getBoundsArray: function() {
                var q = [];
                for (var h = 0; h < this.bins.length; h++) {
                    q.push(this.bins[h].lowerBound)
                }
                if (this.bins.length > 0) {
                    q.push(this.bins[this.bins.length - 1].upperBound)
                }
                return q
            },
            CLASS_NAME: "mapfish.GeoStat.Classification"
        });
        mapfish.GeoStat.Facility = OpenLayers.Class(mapfish.GeoStat, {
            classification: null,
            gis: null,
            view: null,
            featureStore: Ext.create("Ext.data.Store", {
                fields: ["id", "name"],
                features: [],
                loadFeatures: function(q) {
                    if (q && q.length) {
                        var r = [];
                        for (var h = 0; h < q.length; h++) {
                            r.push([q[h].attributes.id, q[h].attributes.name])
                        }
                        this.loadData(r);
                        this.sortStore();
                        this.features = q
                    } else {
                        this.removeAll()
                    }
                },
                sortStore: function() {
                    this.sort("name", "ASC")
                }
            }),
            initialize: function(i, h) {
                mapfish.GeoStat.prototype.initialize.apply(this, arguments)
            },
            getLoader: function() {
                return GIS.core.LayerLoaderFacility(this.gis, this.layer)
            },
            decode: function(t) {
                var s, u, h, q = {
                    type: "FeatureCollection",
                    crs: {
                        type: "EPSG",
                        properties: {
                            code: "4326"
                        }
                    },
                    features: []
                };
                for (var r = 0; r < t.length; r++) {
                    h = t[r];
                    s = {
                        type: "Feature",
                        geometry: {
                            type: parseInt(h.ty) === 1 ? "Point" : "MultiPolygon",
                            coordinates: JSON.parse(h.co)
                        },
                        properties: {
                            id: h.id,
                            name: h.na
                        }
                    };
                    s.properties = Ext.Object.merge(s.properties, h.dimensions);
                    q.features.push(s)
                }
                return q
            },
            reset: function() {
                this.layer.destroyFeatures();
                this.layer.legendPanel.update("");
                this.layer.legendPanel.collapse();
                if (this.layer.widget) {
                    this.layer.widget.reset()
                }
            },
            extendView: function(h, i) {
                h = h || this.view;
                h.organisationUnitGroupSet = i.organisationUnitGroupSet || h.organisationUnitGroupSet;
                h.organisationUnitLevel = i.organisationUnitLevel || h.organisationUnitLevel;
                h.parentOrganisationUnit = i.parentOrganisationUnit || h.parentOrganisationUnit;
                h.parentLevel = i.parentLevel || h.parentLevel;
                h.parentGraph = i.parentGraph || h.parentGraph;
                h.opacity = i.opacity || h.opacity;
                return h
            },
            updateOptions: function(h) {
                this.addOptions(h)
            },
            applyClassification: function(q) {
                this.updateOptions(q);
                var h = this.gis.store.groupsByGroupSet.data.items;
                var t = new Array(h.length);
                for (var r = 0; r < h.length; r++) {
                    var s = new OpenLayers.Rule({
                        symbolizer: {
                            pointRadius: 8,
                            externalGraphic: "../images/orgunitgroup/" + h[r].data.symbol
                        },
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: this.indicator,
                            value: h[r].data.name
                        })
                    });
                    t[r] = s
                }
                this.extendStyle(t);
                mapfish.GeoStat.prototype.applyClassification.apply(this, arguments)
            },
            updateLegend: function() {
                var r = document.createElement("div"),
                    s = document.createElement("div"),
                    h = this.gis.store.groupsByGroupSet.data.items;
                for (var q = 0; q < h.length; q++) {
                    s = document.createElement("div");
                    s.style.backgroundImage = "url(../images/orgunitgroup/" + h[q].data.symbol + ")";
                    s.style.backgroundRepeat = "no-repeat";
                    s.style.width = "21px";
                    s.style.height = "16px";
                    s.style.marginBottom = "2px";
                    s.style.cssFloat = "left";
                    r.appendChild(s);
                    s = document.createElement("div");
                    s.innerHTML = h[q].data.name;
                    s.style.height = "16px";
                    s.style.lineHeight = "17px";
                    r.appendChild(s);
                    s = document.createElement("div");
                    s.style.clear = "left";
                    r.appendChild(s)
                }
                this.layer.legendPanel.update(r.outerHTML)
            },
            CLASS_NAME: "mapfish.GeoStat.Facility"
        });
        mapfish.GeoStat.Event = OpenLayers.Class(mapfish.GeoStat, {
            colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
            method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
            numClasses: 5,
            minSize: 4,
            maxSize: 4,
            minVal: null,
            maxVal: null,
            defaultSymbolizer: {
                fillOpacity: 1
            },
            classification: null,
            colorInterpolation: null,
            gis: null,
            view: null,
            featureStore: Ext.create("Ext.data.Store", {
                fields: ["id", "name"],
                features: [],
                loadFeatures: function(q) {
                    if (q && q.length) {
                        var r = [];
                        for (var h = 0; h < q.length; h++) {
                            r.push([q[h].attributes.id, q[h].attributes.name])
                        }
                        this.loadData(r);
                        this.sortStore();
                        this.features = q
                    } else {
                        this.removeAll()
                    }
                },
                sortStore: function() {
                    this.sort("name", "ASC")
                }
            }),
            initialize: function(i, h) {
                mapfish.GeoStat.prototype.initialize.apply(this, arguments)
            },
            getLoader: function() {
                return GIS.core.LayerLoaderEvent(this.gis, this.layer)
            },
            reset: function() {
                this.layer.destroyFeatures();
                if (this.layer.widget) {
                    this.layer.widget.reset()
                }
            },
            extendView: function(h, i) {
                h = h || this.view;
                h.organisationUnitLevel = i.organisationUnitLevel || h.organisationUnitLevel;
                h.parentOrganisationUnit = i.parentOrganisationUnit || h.parentOrganisationUnit;
                h.parentLevel = i.parentLevel || h.parentLevel;
                h.parentGraph = i.parentGraph || h.parentGraph;
                h.opacity = i.opacity || h.opacity;
                return h
            },
            getLegendConfig: function() {
                return
            },
            getImageLegendConfig: function() {
                return
            },
            updateOptions: function(i) {
                var h = OpenLayers.Util.extend({}, this.options);
                this.addOptions(i);
                if (i) {
                    this.setClassification()
                }
            },
            createColorInterpolation: function() {
                var h = this.classification.bins.length;
                this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], h)
            },
            setClassification: function() {
                var q = [];
                for (var r = 0; r < this.layer.features.length; r++) {
                    q.push(this.layer.features[r].attributes[this.indicator])
                }
                var h = {
                    labelGenerator: this.options.labelGenerator
                };
                var s = new mapfish.GeoStat.Distribution(q, h);
                this.minVal = s.minVal;
                this.maxVal = s.maxVal;
                this.classification = s.classify(this.method, this.numClasses, null);
                this.createColorInterpolation()
            },
            applyClassification: function(h) {
                this.updateOptions(h);
                var u = OpenLayers.Function.bind(function(v) {
                    var w = v.attributes[this.indicator];
                    var i = (w - this.minVal) / (this.maxVal - this.minVal) * (this.maxSize - this.minSize) + this.minSize;
                    return i || this.minSize
                }, this);
                this.extendStyle(null, {
                    pointRadius: "${calculateRadius}"
                }, {
                    calculateRadius: u
                });
                var s = this.classification.getBoundsArray();
                var t = new Array(s.length - 1);
                for (var q = 0; q < s.length - 1; q++) {
                    var r = new OpenLayers.Rule({
                        symbolizer: {
                            fillColor: this.colorInterpolation[q].toHexString()
                        },
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.BETWEEN,
                            property: this.indicator,
                            lowerBoundary: s[q],
                            upperBoundary: s[q + 1]
                        })
                    });
                    t[q] = r
                }
                this.extendStyle(t);
                mapfish.GeoStat.prototype.applyClassification.apply(this, arguments)
            },
            updateLegend: function() {},
            CLASS_NAME: "mapfish.GeoStat.Event"
        });
        mapfish.GeoStat.Boundary = OpenLayers.Class(mapfish.GeoStat, {
            colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
            method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
            numClasses: 5,
            minSize: 3,
            maxSize: 20,
            minVal: null,
            maxVal: null,
            defaultSymbolizer: {
                fillOpacity: 1
            },
            classification: null,
            colorInterpolation: null,
            gis: null,
            view: null,
            featureStore: Ext.create("Ext.data.Store", {
                fields: ["id", "name"],
                features: [],
                loadFeatures: function(q) {
                    if (q && q.length) {
                        var r = [];
                        for (var h = 0; h < q.length; h++) {
                            r.push([q[h].attributes.id, q[h].attributes.name])
                        }
                        this.loadData(r);
                        this.sortStore();
                        this.features = q
                    } else {
                        this.removeAll()
                    }
                },
                sortStore: function() {
                    this.sort("name", "ASC")
                }
            }),
            initialize: function(i, h) {
                mapfish.GeoStat.prototype.initialize.apply(this, arguments)
            },
            getLoader: function() {
                return GIS.core.LayerLoaderBoundary(this.gis, this.layer)
            },
            reset: function() {
                this.layer.destroyFeatures();
                if (this.layer.widget) {
                    this.layer.widget.reset()
                }
            },
            extendView: function(h, i) {
                h = h || this.view;
                h.organisationUnitLevel = i.organisationUnitLevel || h.organisationUnitLevel;
                h.parentOrganisationUnit = i.parentOrganisationUnit || h.parentOrganisationUnit;
                h.parentLevel = i.parentLevel || h.parentLevel;
                h.parentGraph = i.parentGraph || h.parentGraph;
                h.opacity = i.opacity || h.opacity;
                return h
            },
            getLegendConfig: function() {
                return
            },
            getImageLegendConfig: function() {
                return
            },
            getDefaultFeatureStyle: function() {
                return {
                    fillOpacity: 0,
                    fillColor: "#000",
                    strokeColor: "#000",
                    strokeWidth: 1,
                    pointRadius: 5,
                    cursor: "pointer"
                }
            },
            setFeatureStyle: function(q) {
                for (var h = 0; h < this.layer.features.length; h++) {
                    this.layer.features[h].style = q
                }
                this.layer.redraw()
            },
            setFeatureLabelStyle: function(u, v, h) {
                for (var s = 0, r, t, q; s < this.layer.features.length; s++) {
                    r = this.layer.features[s];
                    t = r.style;
                    if (u) {
                        t.label = r.attributes.label;
                        t.fontColor = t.strokeColor;
                        t.fontWeight = t.strokeWidth > 1 ? "bold" : "normal";
                        t.labelAlign = "cr";
                        t.labelYOffset = 13;
                        if (h.labelFontSize) {
                            t.fontSize = h.labelFontSize
                        }
                        if (h.labelFontStyle) {
                            t.fontStyle = h.labelFontStyle
                        }
                    } else {
                        t.label = null
                    }
                }
                if (!v) {
                    this.layer.redraw()
                }
            },
            updateOptions: function(i) {
                var h = OpenLayers.Util.extend({}, this.options);
                this.addOptions(i);
                if (i) {
                    this.setClassification()
                }
            },
            createColorInterpolation: function() {
                var h = this.classification.bins.length;
                this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], h)
            },
            setClassification: function() {
                var q = [];
                for (var r = 0; r < this.layer.features.length; r++) {
                    q.push(this.layer.features[r].attributes[this.indicator])
                }
                var h = {
                    labelGenerator: this.options.labelGenerator
                };
                var s = new mapfish.GeoStat.Distribution(q, h);
                this.minVal = s.minVal;
                this.maxVal = s.maxVal;
                this.classification = s.classify(this.method, this.numClasses, null);
                this.createColorInterpolation()
            },
            applyClassification: function(h) {
                this.updateOptions(h);
                var u = OpenLayers.Function.bind(function(v) {
                    var w = v.attributes[this.indicator];
                    var i = (w - this.minVal) / (this.maxVal - this.minVal) * (this.maxSize - this.minSize) + this.minSize;
                    return i || this.minSize
                }, this);
                this.extendStyle(null, {
                    pointRadius: "${calculateRadius}"
                }, {
                    calculateRadius: u
                });
                var s = this.classification.getBoundsArray();
                var t = new Array(s.length - 1);
                for (var q = 0; q < s.length - 1; q++) {
                    var r = new OpenLayers.Rule({
                        symbolizer: {
                            fillColor: this.colorInterpolation[q].toHexString()
                        },
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.BETWEEN,
                            property: this.indicator,
                            lowerBoundary: s[q],
                            upperBoundary: s[q + 1]
                        })
                    });
                    t[q] = r
                }
                this.extendStyle(t);
                mapfish.GeoStat.prototype.applyClassification.apply(this, arguments)
            },
            updateLegend: function() {},
            CLASS_NAME: "mapfish.GeoStat.Boundary"
        });
        mapfish.GeoStat.createThematic = function(h) {
            mapfish.GeoStat[h] = OpenLayers.Class(mapfish.GeoStat, {
                colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
                method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
                numClasses: 5,
                bounds: null,
                minSize: 3,
                maxSize: 20,
                minVal: null,
                maxVal: null,
                defaultSymbolizer: {
                    fillOpacity: 1
                },
                classification: null,
                colorInterpolation: null,
                gis: null,
                view: null,
                featureStore: Ext.create("Ext.data.Store", {
                    fields: ["id", "name"],
                    features: [],
                    loadFeatures: function(r) {
                        if (r && r.length) {
                            var s = [];
                            this.features = r;
                            for (var q = 0; q < r.length; q++) {
                                s.push([r[q].attributes.id, r[q].attributes.name])
                            }
                            this.loadData(s);
                            this.sortStore()
                        } else {
                            this.removeAll()
                        }
                    },
                    sortStore: function() {
                        this.sort("name", "ASC")
                    }
                }),
                initialize: function(q, i) {
                    mapfish.GeoStat.prototype.initialize.apply(this, arguments)
                },
                getLoader: function() {
                    return GIS.core.LayerLoaderThematic(this.gis, this.layer)
                },
                reset: function() {
                    this.layer.destroyFeatures();
                    this.featureStore.loadFeatures(this.layer.features.slice(0));
                    this.layer.legendPanel.update("");
                    this.layer.legendPanel.collapse();
                    if (this.layer.widget) {
                        this.layer.widget.reset()
                    }
                },
                extendView: function(i, q) {
                    i = i || this.view;
                    i.valueType = q.valueType || i.valueType;
                    i.indicatorGroup = q.indicatorGroup || i.indicatorGroup;
                    i.indicator = q.indicator || i.indicator;
                    i.dataElementGroup = q.dataElementGroup || i.dataElementGroup;
                    i.dataElement = q.dataElement || i.dataElement;
                    i.periodType = q.periodType || i.periodType;
                    i.period = q.period || i.period;
                    i.legendType = q.legendType || i.legendType;
                    i.legendSet = q.legendSet || i.legendSet;
                    i.classes = q.classes || i.classes;
                    i.method = q.method || i.method;
                    i.colorLow = q.colorLow || i.colorLow;
                    i.colorHigh = q.colorHigh || i.colorHigh;
                    i.radiusLow = q.radiusLow || i.radiusLow;
                    i.radiusHigh = q.radiusHigh || i.radiusHigh;
                    i.organisationUnitLevel = q.organisationUnitLevel || i.organisationUnitLevel;
                    i.parentOrganisationUnit = q.parentOrganisationUnit || i.parentOrganisationUnit;
                    i.parentLevel = q.parentLevel || i.parentLevel;
                    i.parentGraph = q.parentGraph || i.parentGraph;
                    i.opacity = q.opacity || i.opacity;
                    return i
                },
                getImageLegendConfig: function() {
                    var t = this.classification.bins,
                        r = this.colorInterpolation,
                        q = [];
                    for (var s = 0; s < t.length; s++) {
                        q.push({
                            color: r[s].toHexString(),
                            label: t[s].lowerBound.toFixed(1) + " - " + t[s].upperBound.toFixed(1) + " (" + t[s].nbVal + ")"
                        })
                    }
                    return q
                },
                updateOptions: function(q) {
                    var i = OpenLayers.Util.extend({}, this.options);
                    this.addOptions(q);
                    if (q) {
                        this.setClassification()
                    }
                },
                createColorInterpolation: function() {
                    var i = this.classification.bins.length;
                    if (!this.view.legendSet) {
                        this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], i)
                    }
                },
                setClassification: function() {
                    var r = [];
                    for (var s = 0; s < this.layer.features.length; s++) {
                        r.push(this.layer.features[s].attributes[this.indicator])
                    }
                    var q = {
                        labelGenerator: this.options.labelGenerator
                    };
                    var t = new mapfish.GeoStat.Distribution(r, q);
                    this.minVal = t.minVal;
                    this.maxVal = t.maxVal;
                    if (this.view.legendType === this.gis.conf.finals.widget.legendtype_predefined) {
                        if (this.bounds[0] > this.minVal) {
                            this.bounds.unshift(this.minVal);
                            this.colorInterpolation.unshift(new mapfish.ColorRgb(240, 240, 240))
                        }
                        if (this.bounds[this.bounds.length - 1] < this.maxVal) {
                            this.bounds.push(this.maxVal);
                            this.colorInterpolation.push(new mapfish.ColorRgb(240, 240, 240))
                        }
                    }
                    this.classification = t.classify(this.method, this.numClasses, this.bounds);
                    this.createColorInterpolation()
                },
                applyClassification: function(q, s) {
                    this.updateOptions(q, s);
                    var w = OpenLayers.Function.bind(function(x) {
                        var y = x.attributes[this.indicator];
                        var i = (y - this.minVal) / (this.maxVal - this.minVal) * (this.maxSize - this.minSize) + this.minSize;
                        return i || this.minSize
                    }, this);
                    this.extendStyle(null, {
                        pointRadius: "${calculateRadius}"
                    }, {
                        calculateRadius: w
                    });
                    var u = this.classification.getBoundsArray();
                    var v = new Array(u.length - 1);
                    for (var r = 0; r < u.length - 1; r++) {
                        var t = new OpenLayers.Rule({
                            symbolizer: {
                                fillColor: this.colorInterpolation[r].toHexString()
                            },
                            filter: new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.BETWEEN,
                                property: this.indicator,
                                lowerBoundary: u[r],
                                upperBoundary: u[r + 1]
                            })
                        });
                        v[r] = t
                    }
                    this.extendStyle(v);
                    mapfish.GeoStat.prototype.applyClassification.apply(this, arguments)
                },
                updateLegend: function() {
                    var r = document.createElement("div"),
                        t, s;
                    t = document.createElement("div");
                    t.style.height = "14px";
                    t.style.overflow = "hidden";
                    t.title = this.view.columns[0].items[0].name;
                    t.innerHTML = this.view.columns[0].items[0].name;
                    r.appendChild(t);
                    t = document.createElement("div");
                    t.style.clear = "left";
                    r.appendChild(t);
                    t = document.createElement("div");
                    t.style.height = "14px";
                    t.style.overflow = "hidden";
                    t.title = this.view.filters[0].items[0].name;
                    t.innerHTML = this.view.filters[0].items[0].name;
                    r.appendChild(t);
                    t = document.createElement("div");
                    t.style.clear = "left";
                    r.appendChild(t);
                    t = document.createElement("div");
                    t.style.width = "1px";
                    t.style.height = "5px";
                    r.appendChild(t);
                    if (this.view.legendSet) {
                        for (var q = 0; q < this.classification.bins.length; q++) {
                            t = document.createElement("div");
                            t.style.backgroundColor = this.colorInterpolation[q].toHexString();
                            t.style.width = "30px";
                            t.style.height = this.view.legendSet.names[q] ? "25px" : "20px";
                            t.style.cssFloat = "left";
                            t.style.marginRight = "8px";
                            r.appendChild(t);
                            t = document.createElement("div");
                            t.style.lineHeight = this.view.legendSet.names[q] ? "12px" : "7px";
                            t.innerHTML = '<b style="color:#222; font-size:10px !important">' + (this.view.legendSet.names[q] || "") + "</b><br/>" + this.classification.bins[q].label;
                            r.appendChild(t);
                            t = document.createElement("div");
                            t.style.clear = "left";
                            r.appendChild(t)
                        }
                    } else {
                        for (var q = 0; q < this.classification.bins.length; q++) {
                            t = document.createElement("div");
                            t.style.backgroundColor = this.colorInterpolation[q].toHexString();
                            t.style.width = "30px";
                            t.style.height = "15px";
                            t.style.cssFloat = "left";
                            t.style.marginRight = "8px";
                            r.appendChild(t);
                            t = document.createElement("div");
                            t.innerHTML = this.classification.bins[q].label;
                            r.appendChild(t);
                            t = document.createElement("div");
                            t.style.clear = "left";
                            r.appendChild(t)
                        }
                    }
                    this.layer.legendPanel.update(r.outerHTML)
                },
                CLASS_NAME: "mapfish.GeoStat." + h
            })
        };
        mapfish.GeoStat.createThematic("Thematic1");
        mapfish.GeoStat.createThematic("Thematic2");
        mapfish.GeoStat.createThematic("Thematic3");
        mapfish.GeoStat.createThematic("Thematic4")
    }());
    var f = {
            user: {},
            systemInfo: {}
        },
        e = [],
        g = false,
        b = false,
        a, c, d;
    GIS.i18n = {
        facility_layer_legend: "Facility layer legend",
        thematic_layer_1_legend: "Thematic layer 1 legend",
        thematic_layer_2_legend: "Thematic layer 2 legend",
        thematic_layer_3_legend: "Thematic layer 3 legend",
        thematic_layer_4_legend: "Thematic layer 4 legend",
        measure_distance: "Measure distance"
    };
    GIS.plugin = {};
    a = function(h) {
        var n = false,
            m = [],
            l = 0,
            k;
        f.contextPath = h;
        k = function() {
            if (++l === m.length) {
                b = true;
                for (var o = 0; o < e.length; o++) {
                    d(e[o])
                }
                e = []
            }
        };
        m.push({
            url: h + "/api/systemSettings.jsonp?key=keyCalendar&key=keyDateFormat",
            success: function(o) {
                var i = o;
                f.systemInfo.dateFormat = Ext.isString(i.keyDateFormat) ? i.keyDateFormat.toLowerCase() : "yyyy-mm-dd";
                f.systemInfo.calendar = i.keyCalendar;
                Ext.data.JsonP.request({
                    url: h + "/api/me/user-account.jsonp",
                    success: function(p) {
                        f.userAccount = p;
                        Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/jQuery/jquery.min.js", function() {
                            Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/dhis2/dhis2.util.js", function() {
                                Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/dhis2/dhis2.storage.js", function() {
                                    Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/dhis2/dhis2.storage.idb.js", function() {
                                        Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/dhis2/dhis2.storage.ss.js", function() {
                                            Ext.Loader.injectScriptElement(h + "/dhis-web-commons/javascripts/dhis2/dhis2.storage.memory.js", function() {
                                                var v = "en",
                                                    t = "name",
                                                    s, u, r, q;
                                                f.userAccount.settings.keyUiLocale = f.userAccount.settings.keyUiLocale || v;
                                                f.userAccount.settings.keyAnalysisDisplayProperty = f.userAccount.settings.keyAnalysisDisplayProperty || t;
                                                u = f.contextPath;
                                                r = f.userAccount.settings.keyUiLocale;
                                                keyAnalysisDisplayProperty = f.userAccount.settings.keyAnalysisDisplayProperty;
                                                s = keyAnalysisDisplayProperty === t ? keyAnalysisDisplayProperty : keyAnalysisDisplayProperty + "|rename(" + t + ")";
                                                q = f.systemInfo.dateFormat;
                                                f.namePropertyUrl = s;
                                                dhis2.util.namespace("dhis2.er");
                                                dhis2.er.store = dhis2.er.store || new dhis2.storage.Store({
                                                    name: "dhis2",
                                                    adapters: [dhis2.storage.IndexedDBAdapter, dhis2.storage.DomSessionStorageAdapter, dhis2.storage.InMemoryAdapter],
                                                    objectStores: ["optionSets"]
                                                });
                                                Ext.data.JsonP.request({
                                                    url: u + "/api/optionSets.jsonp?fields=id,version&paging=false",
                                                    success: function(B) {
                                                        var A = B.optionSets || [],
                                                            w = dhis2.er.store,
                                                            y = [],
                                                            x = "",
                                                            z = 0,
                                                            D, C;
                                                        C = function() {
                                                            if (++z === A.length) {
                                                                if (!y.length) {
                                                                    k();
                                                                    return
                                                                }
                                                                for (var E = 0; E < y.length; E++) {
                                                                    x += "&filter=id:eq:" + y[E]
                                                                }
                                                                Ext.data.JsonP.request({
                                                                    url: u + "/api/optionSets.jsonp?fields=id,name,version,options[code,name]&paging=false" + x,
                                                                    success: function(G) {
                                                                        var F = G.optionSets;
                                                                        w.setAll("optionSets", F).done(k)
                                                                    }
                                                                })
                                                            }
                                                        };
                                                        registerOptionSet = function(E) {
                                                            w.get("optionSets", E.id).done(function(F) {
                                                                if (!Ext.isObject(F) || F.version !== E.version) {
                                                                    y.push(E.id)
                                                                }
                                                                C()
                                                            })
                                                        };
                                                        w.open().done(function() {
                                                            for (var E = 0; E < A.length; E++) {
                                                                registerOptionSet(A[E])
                                                            }
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    }
                })
            }
        });
        m.push({
            url: h + "/api/organisationUnits.jsonp?userOnly=true&fields=id,name,children[id,name]&paging=false",
            success: function(s) {
                var q = s.organisationUnits || [],
                    p = [],
                    t = [];
                if (q.length) {
                    for (var o = 0, u; o < q.length; o++) {
                        u = q[o];
                        p.push(u.id);
                        if (u.children) {
                            t = Ext.Array.clean(t.concat(Ext.Array.pluck(u.children, "id") || []))
                        }
                    }
                    f.user = f.user || {};
                    f.user.ou = p;
                    f.user.ouc = t
                } else {
                    alert("User is not assigned to any organisation units")
                }
                k()
            }
        });
        m.push({
            url: h + "/api/dimensions.jsonp?links=false&paging=false",
            success: function(i) {
                f.dimensions = i.dimensions;
                k()
            }
        });
        for (var j = 0; j < m.length; j++) {
            Ext.data.JsonP.request(m[j])
        }
    };
    c = function() {
        var h = ".gis-plugin, .gis-plugin * { font-family: arial, sans-serif, liberation sans, consolas; } \n";
        h += ".x-panel-body, .x-window-body * { font-size: 11px; } \n";
        h += ".x-panel-header { height: 30px; padding: 7px 4px 4px 7px; border: 0 none; } \n";
        h += ".gis-container-default .x-window-body { padding: 5px; background: #fff; } \n";
        h += ".olControlPanel { position: absolute; top: 0; right: 0; border: 0 none; } \n";
        h += '.olControlButtonItemActive { background: #556; color: #fff; width: 24px; height: 24px; opacity: 0.75; filter: alpha(opacity=75); -ms-filter: "alpha(opacity=75)"; cursor: pointer; cursor: hand; text-align: center; font-size: 21px !important; text-shadow: 0 0 1px #ddd; } \n';
        h += ".olControlPanel.zoomIn { right: 72px; } \n";
        h += ".olControlPanel.zoomIn .olControlButtonItemActive { border-bottom-left-radius: 2px; } \n";
        h += ".olControlPanel.zoomOut { right: 48px; } \n";
        h += ".olControlPanel.zoomVisible { right: 24px; } \n";
        h += ".olControlPermalink { display: none !important; } \n";
        h += '.olControlMousePosition { background: #fff !important; opacity: 0.8 !important; filter: alpha(opacity=80) !important; -ms-filter: "alpha(opacity=80)" !important; right: 0 !important; bottom: 0 !important; border-top-left-radius: 2px !important; padding: 2px 2px 2px 5px !important; color: #000 !important; -webkit-text-stroke-width: 0.2px; -webkit-text-stroke-color: #555; } \n';
        h += ".olControlMousePosition * { font-size: 10px !important; } \n";
        h += ".text-mouseposition-lonlat { color: #555; } \n";
        h += ".olLayerGoogleCopyright, .olLayerGoogleV3.olLayerGooglePoweredBy { display: none; } \n";
        h += '#google-logo { background: url("' + f.contextPath + '/dhis-web-mapping/images/google-logo.png") no-repeat; width: 40px; height: 13px; margin-left: 6px; display: inline-block; vertical-align: bottom; cursor: pointer; cursor: hand; } \n';
        h += ".olControlScaleLine { left: 5px !important; bottom: 5px !important; } \n";
        h += ".olControlScaleLineBottom { display: none; } \n";
        h += ".olControlScaleLineTop { font-weight: bold; } \n";
        h += ".x-mask-msg { padding: 0; border: 0 none; background-image: none; background-color: transparent; } \n";
        h += ".x-mask-msg div { background-position: 11px center; } \n";
        h += ".x-mask-msg .x-mask-loading { border: 0 none; background-color: #000; color: #fff; border-radius: 2px; padding: 12px 14px 12px 30px; opacity: 0.65; } \n";
        h += ".gis-window-widget-feature { padding: 0; border: 0 none; border-radius: 0; background: transparent; box-shadow: none; } \n";
        h += ".gis-window-widget-feature .x-window-body-default { border: 0 none; background: transparent; } \n";
        h += '.gis-window-widget-feature .x-window-body-default .x-panel-body-default { border: 0 none; background: #556; opacity: 0.92; filter: alpha(opacity=92); -ms-filter: "alpha(opacity=92)"; padding: 5px 8px 5px 8px; border-bottom-left-radius: 2px; border-bottom-right-radius: 2px; color: #fff; font-weight: bold; letter-spacing: 1px; } \n';
        h += ".x-menu-body { border:1px solid #bbb; border-radius: 2px; padding: 0; background-color: #fff !important; } \n";
        h += ".x-menu-item-active .x-menu-item-link {	border-radius: 0; border-color: #e1e1e1; background-color: #e1e1e1; background-image: none; } \n";
        h += ".x-menu-item-link { padding: 4px 5px 4px 26px; } \n";
        h += ".x-menu-item-text { color: #111; } \n";
        h += ".disabled { opacity: 0.4; cursor: default !important; } \n";
        h += ".el-opacity-1 { opacity: 1 !important; } \n";
        h += ".el-border-0, .el-border-0 .x-panel-body { border: 0 none !important; } \n";
        h += ".el-fontsize-10 { font-size: 10px !important; } \n";
        h += ".gis-grid-row-icon-disabled * { cursor: default !important; } \n";
        h += ".gis-toolbar-btn-menu { margin-top: 4px; } \n";
        h += ".gis-toolbar-btn-menu .x-panel-body-default { border-radius: 2px; border-color: #999; } \n";
        h += ".gis-grid .link, .gis-grid .link * { cursor: pointer; cursor: hand; color: blue; text-decoration: underline; } \n";
        h += ".gis-menu-item-icon-drill, .gis-menu-item-icon-float { left: 6px; } \n";
        h += ".gis-menu-item-first.x-menu-item-active .x-menu-item-link {	border-radius: 0; border-top-left-radius: 2px; border-top-right-radius: 2px; } \n";
        h += ".gis-menu-item-last.x-menu-item-active .x-menu-item-link { border-radius: 0; border-bottom-left-radius: 2px; border-bottom-right-radius: 2px; } \n";
        h += '.gis-menu-item-icon-drill { \n background: url("' + f.contextPath + '/dhis-web-mapping/images/drill_16.png") no-repeat; } \n';
        h += '.gis-menu-item-icon-float { background: url("' + f.contextPath + '/dhis-web-mapping/images/float_16.png") no-repeat; } \n';
        h += ".x-color-picker a { padding: 0; } \n";
        h += ".x-color-picker em span { width: 14px; height: 14px; } \n";
        Ext.util.CSS.createStyleSheet(h)
    };
    d = function(k) {
        var m, i, l, h, j;
        m = function() {
            if (!Ext.isString(k.url)) {
                alert("Invalid url (" + k.el + ")");
                return
            }
            if (k.url.split("").pop() === "/") {
                k.url = k.url.substr(0, k.url.length - 1)
            }
            if (!Ext.isString(k.el)) {
                alert("Invalid html element id (" + k.el + ")");
                return
            }
            k.id = k.id || k.uid;
            if (k.id && !Ext.isString(k.id)) {
                alert("Invalid map id (" + k.el + ")");
                return
            }
            return true
        };
        i = function() {
            var n, q, p, o = Ext.get(j.el);
            n = Ext.create("Ext.panel.Panel", {
                renderTo: o,
                width: o.getWidth(),
                height: o.getHeight(),
                cls: "gis-plugin",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "gx_mappanel",
                    map: j.olmap,
                    bodyStyle: "border:0 none",
                    width: o.getWidth() - (j.map.hideLegend ? 0 : 200),
                    height: o.getHeight(),
                    listeners: {
                        added: function() {
                            p = this
                        }
                    }
                }, {
                    xtype: "panel",
                    layout: "anchor",
                    bodyStyle: "border-top:0 none; border-bottom:0 none",
                    width: j.map.hideLegend ? 0 : 200,
                    preventHeader: true,
                    defaults: {
                        bodyStyle: "padding: 6px; border: 0 none",
                        collapsible: true,
                        collapsed: true,
                        animCollapse: false
                    },
                    items: [{
                        title: GIS.i18n.thematic_layer_1_legend,
                        bodyStyle: "padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;",
                        listeners: {
                            added: function() {
                                j.layer.thematic1.legendPanel = this
                            }
                        }
                    }, {
                        title: GIS.i18n.thematic_layer_2_legend,
                        bodyStyle: "padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;",
                        listeners: {
                            added: function() {
                                j.layer.thematic2.legendPanel = this
                            }
                        }
                    }, {
                        title: GIS.i18n.thematic_layer_3_legend,
                        bodyStyle: "padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;",
                        listeners: {
                            added: function() {
                                j.layer.thematic3.legendPanel = this
                            }
                        }
                    }, {
                        title: GIS.i18n.thematic_layer_4_legend,
                        bodyStyle: "padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;",
                        listeners: {
                            added: function() {
                                j.layer.thematic4.legendPanel = this
                            }
                        }
                    }, {
                        title: GIS.i18n.facility_layer_legend,
                        bodyStyle: "padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;",
                        listeners: {
                            added: function() {
                                j.layer.facility.legendPanel = this
                            }
                        }
                    }],
                    listeners: {
                        added: function() {
                            q = this
                        }
                    }
                }],
                listeners: {
                    afterrender: function() {
                        l()
                    }
                }
            });
            n.centerRegion = p;
            n.eastRegion = q;
            return n
        };
        l = function(o) {
            var n = Ext.query(".zoomInButton").length;
            for (var p = 0; p < n; p++) {
                Ext.query(".zoomInButton")[p].innerHTML = '<img src="' + j.init.contextPath + '/dhis-web-mapping/images/zoomin_24.png" />';
                Ext.query(".zoomOutButton")[p].innerHTML = '<img src="' + j.init.contextPath + '/dhis-web-mapping/images/zoomout_24.png" />';
                Ext.query(".zoomVisibleButton")[p].innerHTML = '<img src="' + j.init.contextPath + '/dhis-web-mapping/images/zoomvisible_24.png" />';
                Ext.query(".measureButton")[p].innerHTML = '<img src="' + j.init.contextPath + '/dhis-web-mapping/images/measure_24.png" />'
            }
            if (Ext.isDefined(j.map.baseLayer)) {
                var q = Ext.isString(j.map.baseLayer) ? j.map.baseLayer.split(" ").join("").toLowerCase() : j.map.baseLayer;
                if (!q || q === "none" || q === "off") {
                    j.layer.googleStreets.setVisibility(false)
                } else {
                    if (q === "gh" || q === "googlehybrid") {
                        j.olmap.setBaseLayer(j.layer.googleHybrid)
                    } else {
                        if (q === "osm" || q === "openstreetmap") {
                            j.olmap.setBaseLayer(j.layer.openStreetMap)
                        }
                    }
                }
            }
        };
        h = function() {
            if (!m()) {
                return
            }
            c();
            j = GIS.core.getInstance(f);
            j.el = k.el;
            GIS.core.createSelectHandlers(j, j.layer.boundary);
            GIS.core.createSelectHandlers(j, j.layer.thematic1);
            GIS.core.createSelectHandlers(j, j.layer.thematic2);
            GIS.core.createSelectHandlers(j, j.layer.thematic3);
            GIS.core.createSelectHandlers(j, j.layer.thematic4);
            GIS.core.createSelectHandlers(j, j.layer.facility);
            j.map = k;
            j.viewport = i();
            j.olmap.mask = Ext.create("Ext.LoadMask", j.viewport.centerRegion.getEl(), {
                msg: "Loading"
            });
            GIS.core.MapLoader(j).load()
        }()
    };
    GIS.plugin.getMap = function(h) {
        if (Ext.isString(h.url) && h.url.split("").pop() === "/") {
            h.url = h.url.substr(0, h.url.length - 1)
        }
        if (b) {
            d(h)
        } else {
            e.push(h);
            if (!g) {
                g = true;
                a(h.url)
            }
        }
    };
    DHIS = Ext.isObject(window.DHIS) ? DHIS : {};
    DHIS.getMap = GIS.plugin.getMap
});