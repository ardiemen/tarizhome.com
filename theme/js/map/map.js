document.addEventListener('livewire:navigated', () => {
    // document.addEventListener('DOMContentLoaded', function() {
    let url = document.querySelector("meta[name='app-url']").getAttribute("content");
    let primeColor = document.querySelector("meta[name='app-prime-color']").getAttribute("content");
    let secondColor = document.querySelector("meta[name='app-second-color']").getAttribute("content");
    var indonesiaLowJson = '/theme/js/map/indonesiaLow.json'
    if (null != document.getElementById('indonesiaMap')) {

        am5.array.each(am5.registry.rootElements,
            function(root) {
               if (root.dom.id == 'indonesiaMap') {
                  root.dispose();
               }
            }
         );

        am5.ready(function () {
            var root = am5.Root.new('indonesiaMap')

            root.setThemes([
                am5themes_Animated.new(root)
            ])


            var chart = root.container.children.push(am5map.MapChart.new(root, {
                projection: am5map.geoMercator(),
                layout: root.horizontalLayout,
                maxZoomLevel: 1,
                panX: 'none',
                panY: 'none',
                wheelX: 'none',
                wheelY: 'none'
            }))

            var indicator = root.container.children.push(am5.Container.new(root, {
                width: am5.p100,
                height: am5.p100,
                layer: 1000,
                background: am5.Rectangle.new(root, {
                    fill: am5.color(0xffffff),
                    fillOpacity: 0.7
                })
            }));

            indicator.children.push(am5.Label.new(root, {
                text: "Loading...",
                fontSize: 16,
                x: am5.p50,
                y: am5.p50,
                centerX: am5.p50,
                centerY: am5.p50
            }));

            let hourglass = indicator.children.push(am5.Graphics.new(root, {
                width: 16,
                height: 16,
                fill: am5.color(0x000000),
                x: am5.p50,
                y: am5.p50,
                centerX: am5.p50,
                centerY: am5.p50,
                dy: -45,
                svgPath: "M12 5v10l9 9-9 9v10h24V33l-9-9 9-9V5H12zm20 29v5H16v-5l8-8 8 8zm-8-12-8-8V9h16v5l-8 8z"
            }));

            var hourglassanimation = hourglass.animate({
                key: "rotation",
                to: 180,
                loops: Infinity,
                duration: 2000,
                easing: am5.ease.inOut(am5.ease.cubic)
            });

            loadGeodata('ID')

            function loadGeodata(country) {
                var defaultMap = 'usaLow'

                if (country == 'US') {
                    chart.set('projection', am5map.geoAlbersUsa())
                } else {
                    chart.set('projection', am5map.geoMercator())
                }

                var currentMap = defaultMap
                var title = ''
                if (am5geodata_data_countries2[country] !== undefined) {
                    currentMap = am5geodata_data_countries2[country]['maps'][0]

                    if (am5geodata_data_countries2[country]['country']) {
                        title = am5geodata_data_countries2[country]['country']
                    }
                }

                am5.net.load(indonesiaLowJson, chart).then(function (result) {
                    var geodata = am5.JSONParser.parse(result.response)
                    var data = []
                    for (var i = 0; i < geodata.features.length; i++) {
                        data.push({
                            id: geodata.features[i].id,
                            value: Math.round(Math.random() * 10000)
                        })
                    }

                    polygonSeries.set('geoJSON', geodata)
                    polygonSeries.data.setAll(data)
                })
            }

            var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
                calculateAggregates: true,
                valueField: 'value'
            }))

            polygonSeries.mapPolygons.template.setAll({
                interactive: true
            })

            polygonSeries.mapPolygons.template.states.create('hover', {
                fill: am5.color(primeColor)
            })

            polygonSeries.set('heatRules', [{
                target: polygonSeries.mapPolygons.template,
                dataField: 'value',
                min: am5.color(0xCECECE),
                max: am5.color(0xf7f7f7),
                key: 'fill'
            }])

            // pointer
            var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))
            var colorset = am5.ColorSet.new(root, {})

            pointSeries.bullets.push(function () {
                var container = am5.Container.new(root, {})

                var circle = container.children.push(
                    am5.Circle.new(root, {
                        radius: 3,
                        tooltipY: 0,
                        fill: am5.color(primeColor),
                        strokeOpacity: 0
                    })
                )

                var circle2 = container.children.push(
                    am5.Circle.new(root, {
                        radius: 3,
                        tooltipY: 0,
                        fill: am5.color(primeColor),
                        strokeOpacity: 0,
                        fillOpacity: 1,
                        tooltipHTML: `
                                    <div class="card">
                                        <div class="title">
                                            <h1>{title}</h1>
                                            <h2>"Branch"</h2>
                                        </div>
                                        <div class="content">
                                            <div class="social">
                                                <i class="fas fa-map-marker-alt"></i>
                                                <a href="" target="_blank">
                                                    {address}</a>
                                            </div>

                                            <!--<div class="social">
                                                <i class="fas fa-circle-user"></i>
                                                <a href="" target="_blank">
                                                    {user}</a>
                                            </div>

                                            <div class="social">
                                                <i class="fas fa-phone"></i>
                                                <a href="" target="_blank">
                                                    {contact}</a>
                                            </div>-->
                                        </div>
                                        <div class="circle" style="background-image:url(/storage/{image})"></div>
                                    </div>
                        `,

                        tooltip: am5.Tooltip.new(root, {
                            getFillFromSprite: false,
                            keepTargetHover: true
                        })
                    })
                )
                // var circle = container.children.push(
                //     am5.Circle.new(root, {
                //         radius: 3,
                //         tooltipY: 0,
                //         fill: am5.color(0x155183),
                //         strokeOpacity: 0,
                //         tooltipHTML: `
                //         <div>
                //             <p class="text-white mb-2">{title}</p>
                //             <p class="text-white">{address}</p>
                //             <a class="text-white" href="{maps}"><i class="bi bi-geo-alt"></i> Maps</a>
                //         </div>`,
                //         tooltip: am5.Tooltip.new(root, {
                //             keepTargetHover: true
                //         })
                //     })
                // )

                circle.animate({
                    key: 'scale',
                    from: 1,
                    to: 3,
                    duration: 600,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                })

                circle.animate({
                    key: 'opacity',
                    from: 1,
                    to: 0,
                    duration: 600,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                })

                return am5.Bullet.new(root, {
                    sprite: container
                })
            })

            // menambahkan titik dari database / rest api..
            $.getJSON('/coverage-area', function (cities) {
                for (var i = 0; i < cities.length; i++) {
                    var branch = cities[i]
                    addBranch(branch.longitude, branch.latitude, branch.name, branch.address, branch.pic, branch.phone, branch.media['path'])
                }
            })

            function addBranch(longitude, latitude, branch, address, pic, phone, image) {
                if (branch == 'JSN Pati' || branch == 'JSN Manado') {
                    var pointColor = '#ff7700'
                } else {
                    var pointColor = primeColor
                }

                pointSeries.data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    title: branch,
                    address: address,
                    user: pic,
                    contact: phone,
                    image: image,
                    color: pointColor
                })
            }

            chart.appear(1000, 100);

            window.addEventListener('livewire:navigated', (event) => {
                // window.addEventListener('load', (event) => {
                hourglassanimation.pause();
                indicator.hide();

                setTimeout(function () {
                    hourglassanimation.pause();
                    indicator.hide();
                }, 150)
            })
        })
    }
});

    document.addEventListener('livewire:navigated', (event) => {
        // window.addEventListener('load', (event) => {
        $('#indonesiaMap').css('zoom', '99.99%');

        setTimeout(function () {
            $('#indonesiaMap').css('zoom', '100%');
        }, 10)
    });


