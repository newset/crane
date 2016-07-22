/**
 * Created by my9074 on 16/2/24.
 */
(function () {
    'use strict';

    angular.module('app.utils').factory('chartUtil', chartUtil);

    /* @ngInject */
    function chartUtil($filter) {
        return {
            createDefaultOptions: createDefaultOptions,
            pushData: pushData,
            updateForceY: updateForceY
        };
        
        function createDefaultOptions() {
            return {
                chart: {
                    type: 'lineChart',
                    noData: '暂无数据',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function(d){ return d.x; },
                    y: function(d){ return d.y; },
                    useInteractiveGuideline: true,
                    xAxis: {
                        axisLabel: '时间',
                        tickFormat: function(d){
                            return $filter('date')(d, 'HH:mm:ss');
                        },
                        showMaxMin: false
                    },
                    yAxis: {
                        tickFormat: function(d){
                            return d3.format('.02f')(d)+'%';
                        },
                        axisLabelDistance: -10
                    },
                    pointSize: 0.1,
                    forceY: [0],
                    color: [
                              '#1f77b4',
                              '#ff7f0e',
                              '#2ca02c',
                              '#d62728',
                              '#9467bd',
                              '#8c564b',
                              '#e377c2',
                              '#7f7f7f',
                              '#bcbd22',
                              '#17becf'
                            ],
                },
                title: {
                    enable: true
                }
            }
        }
        
        function pushData(dataContainer, value, pointNum, interval) {
            if (!interval) {
                interval = 1000;
            }
            dataContainer.values.push(value);
            while (dataContainer.values.length !== pointNum) {
                if (dataContainer.values.length > pointNum) {
                    dataContainer.values.shift();
                } else {
                    dataContainer.values.unshift({x: dataContainer.values[0].x-interval, y: 0});
                }
            }
        }
        
        function updateForceY(chartOptions, valueArrays, min, maxRatio, minMax, maxMax) {
            var newForceY = _buildNewForceY(valueArrays, min, maxRatio, minMax, maxMax);
            var flag = false;
            if (!angular.equals(newForceY, chartOptions.forceY)) {
                chartOptions.forceY = newForceY;
                flag = true;
            }
            return flag;
        }
        
        function _buildNewForceY(valueArrays, min, maxRatio, minMax, maxMax) {
            var valueMax = Math.maxPlus(valueArrays, function (valueArray) {
                return Math.maxPlus(valueArray, function (value) {
                    return value.y;
                })
            });
            var curMax = valueMax * maxRatio;
            if (maxMax !== undefined && maxMax < curMax) {
                if (maxMax < valueMax) {
                    curMax = valueMax;
                } else {
                    curMax = maxMax;
                }
            }
            if (minMax !== undefined && curMax < minMax) {
                curMax = minMax;
            }
            return [min, Math.ceil(curMax)];
        }

    }
})();