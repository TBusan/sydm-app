import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region, UrlTile } from 'react-native-maps';

// 天地图API密钥
const TIANDITU_KEY = 'aca91d8c9f59a4f779f39061b8a07737';

// 天地图瓦片类型 - 矢量底图
const TIANDITU_VECTOR = `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`;
// 天地图瓦片类型 - 注记图层
const TIANDITU_ANNOTATION = `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`;
// 天地图瓦片类型 - 卫星影像
const TIANDITU_SATELLITE = `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`;
// 天地图瓦片类型 - 卫星影像注记
const TIANDITU_SATELLITE_ANNOTATION = `https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`;

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapType, setMapType] = useState<'vector' | 'satellite'>('vector');
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 39.9042,  // 默认北京坐标
    longitude: 116.4074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        
        // 请求位置权限
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('位置权限被拒绝');
          setIsLoading(false);
          return;
        }

        // 获取当前位置
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // 更新地图区域到当前位置
        setMapRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('获取位置失败');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const onRegionChange = (region: Region) => {
    setMapRegion(region);
  };

  // 切换地图类型 - 矢量/卫星
  const toggleMapType = () => {
    setMapType(prev => prev === 'vector' ? 'satellite' : 'vector');
  };

  // 跳转到当前位置
  const goToCurrentLocation = () => {
    if (!location) return;
    
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>正在加载地图...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Text style={styles.instructionText}>
          请确保已安装必要的依赖包并配置天地图API密钥
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={onRegionChange}
        zoomEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
      >
        {/* 天地图底图 */}
        {mapType === 'vector' ? (
          <>
            <UrlTile
              urlTemplate={TIANDITU_VECTOR}
              zIndex={1}
              maximumZ={18}
              flipY={false}
            />
            <UrlTile
              urlTemplate={TIANDITU_ANNOTATION}
              zIndex={2}
              maximumZ={18}
              flipY={false}
            />
          </>
        ) : (
          <>
            <UrlTile
              urlTemplate={TIANDITU_SATELLITE}
              zIndex={1}
              maximumZ={18}
              flipY={false}
            />
            <UrlTile
              urlTemplate={TIANDITU_SATELLITE_ANNOTATION}
              zIndex={2}
              maximumZ={18}
              flipY={false}
            />
          </>
        )}
        
        {/* 当前位置标记 */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
            title="我的位置"
            description="您当前所在的位置"
          />
        )}
      </MapView>
      
      {/* 位置按钮 */}
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={goToCurrentLocation}
      >
        <Text style={styles.buttonText}>定位</Text>
      </TouchableOpacity>
      
      {/* 切换底图按钮 */}
      <TouchableOpacity 
        style={styles.mapTypeButton}
        onPress={toggleMapType}
      >
        <Text style={styles.buttonText}>
          {mapType === 'vector' ? '切换卫星图' : '切换矢量图'}
        </Text>
      </TouchableOpacity>

      {/* 坐标信息框 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>当前坐标</Text>
        <Text style={styles.infoText}>
          经度: {mapRegion.longitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          纬度: {mapRegion.latitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapTypeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
  }
}); 