import { Image, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import icons from "../constants/icons";

const PieChartCustom = ({data}) => {
  const pieData = [
    { value: data.protein, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
    { value: data.fat, color: '#BDB2FA', gradientCenterColor: '#8F80F3' },
    { value: data.carbohydrate, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
  ];

  const renderDot = (color) => {
    return (
      <View
        className={`h-2.5 w-2.5 rounded-full mr-2`}
        style={{ backgroundColor: color }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View className="flex-row justify-center mb-2.5">
          <View className="flex-row items-center w-30">
            {renderDot('#8F80F3')}
            <Text className="text-black font-pmedium">Fat: {data.fat}g</Text>
          </View>
        </View>
        <View className="flex-row justify-center">
          <View className="flex-row items-center w-30 mr-5">
            {renderDot('#3BE9DE')}
            <Text className="text-black font-pmedium">Protein: {data.protein}g</Text>
          </View>
          <View className="flex-row items-center w-30">
            {renderDot('#FF7F97')}
            <Text className="text-black font-pmedium">Carbohydrate: {data.carbohydrate}g</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View className="py-25 bg-white flex-1">
        <View className="px-5 items-center">
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor="#fff"
            centerLabelComponent={() => {
              return (
                <View className="justify-center items-center">
                  <Image source={icons.calorie} tintColor={'#FF0000'} className='w-6 h-6'/>
                  <Text className="text-2xl text-black font-bold">{data.calories}</Text>
                  <Text className="text-lg text-black font-pmedium">Kcal</Text>
                </View>
              );
            }}
          />
        </View>
        {renderLegendComponent()}
    </View>
  );
};

export default PieChartCustom;
