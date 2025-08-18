import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import fonts from "../utils/fonts";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser } from "../config/firebase";
import { omit, pick } from "lodash";
import {
  Calendar,
  CalendarActiveDateRange,
  fromDateId,
  toDateId,
  useCalendar,
} from "@marceloterreiro/flash-calendar";
import {
  add,
  sub,
  format,
  addMinutes,
  startOfHour,
  endOfDay,
  isBefore,
} from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const today = toDateId(new Date());

const DAY_HEIGHT = 30;
const WEEK_DAYS_HEIGHT = 30;
const locale = "en-US";

const linearAccent = "rgba(126, 228, 203, 1)";

const getBaseCalendarMonthFormat = (date: Date) => {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
};

const BookACounsellor = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { width, height } = Dimensions.get("window");

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("reproductive");
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [resource, setResource] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const texts = {
    1: "BOOK A COUNSELLOR",
    2: "AVAILABLE COUNSELLORS",
    3: "SELECT TIME AND DATE",
    4: resource?.["selectedDate"]
      ? format(resource["selectedDate"], "PPP")
      : "",
  };

  const generateTimesToEndOfDay = useCallback(
    (now = new Date(), intervalMinutes = 30) => {
      // Round the current time to the nearest hour
      const roundedNow = startOfHour(addMinutes(now, intervalMinutes));

      // Get the end of the day (11:59 PM)
      const endDay = endOfDay(now);

      // Initialize an empty array for times
      let times: string[] = [];

      // Loop through and add times in 30-minute intervals
      let currentTime = roundedNow;
      while (isBefore(currentTime, endDay)) {
        times.push(format(currentTime, "HH:mm"));
        currentTime = addMinutes(currentTime, intervalMinutes);
      }

      const getItemsBetween = (
        array: string[],
        start: string,
        end: string,
      ): string[] => {
        let startIndex = array.indexOf(start);
        let endIndex = array.indexOf(end);

        if (startIndex > endIndex) {
          startIndex = 0;
          endIndex = array?.length - 1;
        }

        if (startIndex === -1) {
          startIndex = 0;
        }

        if (endIndex === -1) {
          endIndex = array?.length - 1;
        }

        return array.slice(startIndex, endIndex + 1);
      };

      times = getItemsBetween(times, resource?.startTime, resource?.endTime);
      return getItemsBetween(times, resource?.startTime, resource?.endTime);
    },
    [resource?.endTime, resource?.startTime],
  );

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(
    () => [
      {
        startId: resource?.selectedDate ?? undefined,
        endId: resource?.selectedDate ?? undefined,
      },
    ],
    [resource],
  );

  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar({
    calendarActiveDateRanges,
    calendarMinDateId: today,
    calendarMonthId: toDateId(currentCalendarMonth),
    // getCalendarWeekDayFormat: format("E"),
    calendarDisabledDateIds: resource?.unavailableDates,
  });

  const [counsellors, loading] = useCollectionData(
    firestore()
      .collection("counsellors")
      .where("type", "array-contains", selected)
      .orderBy("rank", "desc"),
    { initialValue: [] },
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentCalendarMonth(sub(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentCalendarMonth(add(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  useEffect(() => {
    if (!isFocused) {
      setStep(1);
      setResource({});
      setSelected("reproductive");
    }

    return () => {};
  }, [isFocused]);

  return (
    <>
      <ScrollView
        className="relative bg-white flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 50,
        }}
      >
        {[1, 2, 3].includes(step) && (
          <View
            className="relative"
            style={{
              height: height / 2,
            }}
          >
            <ImageBackground
              source={require("../../assets/resources/book.png")}
              resizeMode="cover"
              style={{
                width,
                height: "100%",
                // ...style("opacity-90"),
              }}
            />
          </View>
        )}

        <View
          className={`${[1, 2, 3].includes(step) ? "-mt-6" : ""}  bg-white pb-10`}
          style={{
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            padding: 10,
            paddingHorizontal: 20,
            // height: height / 1.5,
            // borderWidth: 1,
            // borderColor: "green",
          }}
        >
          <View className="flex flex-row justify-between mb-2" style={{}}>
            {step !== 1 && (
              <Pressable
                onPress={() => {
                  setStep((step) => step - 1);
                }}
              >
                <Entypo name="chevron-thin-left" size={24} color="black" />
              </Pressable>
            )}
            <Text
              className={`${[1, 2, 3].includes(step) ? "text-sm" : "text-base"}  ${step === 1 ? "w-full" : "w-[92%]"} text-center`}
              style={{
                fontFamily: [1, 2, 3].includes(step)
                  ? fonts.fontBold
                  : fonts.fontRegular,
              }}
            >
              {texts[step]}
            </Text>
          </View>

          {step === 1 && (
            <>
              <Text
                className="w-full text-center"
                style={{
                  fontFamily: fonts.fontSemiBold,
                }}
              >
                CHOOSE PROCEDURES
              </Text>

              <View className="flex flex-row flex-wrap justify-center items-center w-100 gap-4 mt-2">
                <Pressable
                  className={`h-36 w-36 bg-green-50 rounded-lg justify-center items-center ${selected === "reproductive" && "border-2 border-appMain"}`}
                  onPress={() => {
                    setSelected("reproductive");
                    setStep((step) => step + 1);
                  }}
                >
                  <Image
                    className="w-[70%] h-[60%] rounded-lg overflow-hidden"
                    source={require("../../assets/resources/reproductive_health_issues.png")}
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs text-center mt-1"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    Reproductive
                  </Text>
                  <Text
                    className="text-xs text-center"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    health issues
                  </Text>
                </Pressable>
                <Pressable
                  className={`h-36 w-36 bg-green-50 rounded-lg justify-center items-center ${selected === "heartbreak" && "border-2 border-appMain"}`}
                  onPress={() => {
                    setSelected("heartbreak");
                    setStep((step) => step + 1);
                  }}
                >
                  <Image
                    className="w-[70%] h-[60%] rounded-lg overflow-hidden"
                    source={require("../../assets/resources/heartbreak_issues.png")}
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs text-center mt-1"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    Heartbreak
                  </Text>
                  <Text
                    className="text-xs text-center"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    issues
                  </Text>
                </Pressable>
                <Pressable
                  className={`h-36 w-36 bg-green-50 rounded-lg justify-center items-center ${selected === "stressed" && "border-2 border-appMain"}`}
                  onPress={() => {
                    setSelected("stressed");
                    setStep((step) => step + 1);
                  }}
                >
                  <Image
                    className="w-[70%] h-[60%] rounded-lg overflow-hidden"
                    source={require("../../assets/resources/stressed_issues.png")}
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs text-center mt-1"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    Stressed
                  </Text>
                  <Text
                    className="text-xs text-center"
                    style={{
                      fontFamily: fonts.fontRegular,
                    }}
                  >
                    issues
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {step === 2 && (
            <View className="justify-center items-center w-100 gap-y-4 mt-2">
              {!loading ? (
                counsellors?.length ? (
                  counsellors?.map((counsellor) => {
                    return (
                      <Pressable
                        key={counsellor?.id}
                        className="flex flex-row w-full items-center bg-green-100 p-3 rounded-xl"
                        onPress={() => {
                          setResource((data) => {
                            return {
                              ...data,
                              ...pick(counsellor, [
                                "name",
                                "email",
                                "title",
                                "sessionLength",
                                "startTime",
                                "endTime",
                              ]),
                            };
                          });
                          setStep((step) => step + 1);
                        }}
                      >
                        <Image
                          className="w-[54px] h-[54px] rounded-full overflow-hidden"
                          source={require("../../assets/resources/reproductive_health_issues.png")}
                          resizeMode="cover"
                        />
                        <View className="ml-3 w-9/12">
                          <Text
                            className=""
                            style={{
                              fontFamily: fonts.fontBold,
                            }}
                          >
                            {counsellor?.name}
                          </Text>
                          <View className="justify-between items-center flex flex-row ">
                            <Text
                              className="text-xs"
                              style={{
                                fontFamily: fonts.fontRegular,
                              }}
                            >
                              {counsellor?.title}
                            </Text>

                            <View className="items-center flex flex-row">
                              <Ionicons
                                name="time-outline"
                                size={11}
                                color="black"
                              />
                              <Text
                                className="text-[11px] opacity-70 ml-1"
                                style={{
                                  fontFamily: fonts.fontRegular,
                                }}
                              >
                                {counsellor?.sessionLength} min
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <>
                    <Text
                      className="text-lg"
                      style={{
                        fontFamily: fonts.fontRegular,
                        textAlign: "center",
                      }}
                    >
                      No counsellors available
                    </Text>
                  </>
                )
              ) : (
                <Text
                  className="text-lg"
                  style={{
                    fontFamily: fonts.fontBold,
                    textAlign: "center",
                  }}
                >
                  Loading counsellors...
                </Text>
              )}
            </View>
          )}

          {step === 3 && (
            <View className="flex-1">
              <Calendar.VStack justifyContent="flex-start" spacing={12}>
                <View>
                  <Calendar.HStack
                    alignItems="center"
                    justifyContent="space-around"
                    width="100%"
                    style={{
                      height: 40,
                    }}
                  >
                    {calendarRowMonth !==
                    getBaseCalendarMonthFormat(new Date()) ? (
                      <Pressable onPress={handlePreviousMonth}>
                        <Entypo
                          name="chevron-with-circle-left"
                          size={24}
                          color="black"
                        />
                      </Pressable>
                    ) : (
                      <View />
                    )}
                    <Text
                      style={{
                        fontFamily: fonts.fontRegular,
                        fontSize: 17,
                        textAlign: "center",
                      }}
                    >
                      {calendarRowMonth}
                    </Text>
                    <Pressable onPress={handleNextMonth}>
                      <Entypo
                        name="chevron-with-circle-right"
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  </Calendar.HStack>

                  <Calendar.Row.Week>
                    {weekDaysList.map((day, i) => (
                      <Calendar.Item.WeekName
                        height={WEEK_DAYS_HEIGHT}
                        key={i}
                        theme={{
                          content: {
                            fontFamily: fonts.fontRegular,
                          },
                        }}
                      >
                        {day}
                      </Calendar.Item.WeekName>
                    ))}
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "red",
                        position: "absolute",
                        left: 8,
                        right: 8,
                        bottom: 0,
                      }}
                    />
                  </Calendar.Row.Week>

                  {weeksList.map((week, i) => (
                    <Calendar.Row.Week key={i}>
                      {week.map((day) => (
                        <Calendar.Item.Day.Container
                          dayHeight={DAY_HEIGHT}
                          daySpacing={20}
                          isStartOfWeek={day.isStartOfWeek}
                          key={day.id}
                          theme={{
                            activeDayFiller: {
                              backgroundColor: linearAccent,
                            },
                          }}
                        >
                          <Calendar.Item.Day
                            height={DAY_HEIGHT}
                            metadata={day}
                            onPress={(dateId) => {
                              setCurrentCalendarMonth(fromDateId(dateId));
                              setResource((data) => {
                                return {
                                  ...data,
                                  selectedDate: fromDateId(dateId),
                                };
                              });
                              setStep((step) => step + 1);
                            }}
                            theme={{
                              base: () => ({
                                content: {
                                  fontFamily: fonts.fontRegular,
                                },
                                container: {
                                  padding: 0,
                                  borderRadius: 0,
                                },
                              }),
                              today: ({ isPressed }) => ({
                                container: {
                                  borderColor: "rgba(255, 255, 255, 0.5)",
                                  borderRadius: isPressed ? 4 : 30,
                                  backgroundColor: isPressed
                                    ? linearAccent
                                    : "black",
                                },
                                content: {
                                  color: isPressed
                                    ? "#ffffff"
                                    : "rgba(255, 255, 255, 0.5)",
                                },
                              }),
                              idle: ({ isDifferentMonth }) => ({
                                content: isDifferentMonth
                                  ? {
                                      color: "gray",
                                    }
                                  : {},
                              }),
                              active: ({ isEndOfRange, isStartOfRange }) => ({
                                container: {
                                  backgroundColor: linearAccent,
                                  borderTopLeftRadius: isStartOfRange ? 4 : 0,
                                  borderBottomLeftRadius: isStartOfRange
                                    ? 4
                                    : 0,
                                  borderTopRightRadius: isEndOfRange ? 4 : 0,
                                  borderBottomRightRadius: isEndOfRange ? 4 : 0,
                                },
                                content: {
                                  color: "#ffffff",
                                },
                              }),
                            }}
                          >
                            {day.displayLabel}
                          </Calendar.Item.Day>
                        </Calendar.Item.Day.Container>
                      ))}
                    </Calendar.Row.Week>
                  ))}
                </View>
              </Calendar.VStack>
            </View>
          )}

          {step === 4 && (
            <View className="justify-center items-center w-100 mt-2">
              {generateTimesToEndOfDay(
                new Date(),
                resource?.sessionLength,
              )?.map((time) => {
                return (
                  <Fragment key={time}>
                    {resource?.selectedTime !== time ? (
                      <Pressable
                        className="border-2 border-appMain w-11/12 py-3 mb-4 rounded-lg"
                        onPress={() => {
                          setResource((data) => {
                            return {
                              ...data,
                              selectedTime: time,
                            };
                          });
                        }}
                      >
                        <Text
                          className="text-center"
                          style={{
                            fontFamily: fonts.fontBold,
                          }}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="flex flex-row justify-between items-center w-11/12 mb-2">
                        <View className="bg-gray-300 py-3 rounded-lg w-[48%]">
                          <Text
                            className="text-center"
                            style={{
                              fontFamily: fonts.fontBold,
                            }}
                          >
                            {time}
                          </Text>
                        </View>
                        <Pressable
                          className="bg-appMain py-3 rounded-lg w-[48%]"
                          onPress={() => {
                            setStep((step) => step + 1);
                          }}
                        >
                          <Text
                            className="text-center text-white"
                            style={{
                              fontFamily: fonts.fontBold,
                            }}
                          >
                            NEXT
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </Fragment>
                );
              })}
            </View>
          )}

          {step === 5 && (
            <View className="justify-center w-100 mt-5">
              <Text
                className="text-[16px]"
                style={{
                  fontFamily: fonts.fontBold,
                }}
              >
                {resource?.name}
              </Text>
              <Text
                className="opacity-70 text-[15px]"
                style={{
                  fontFamily: fonts.fontRegular,
                }}
              >
                {resource?.title}
              </Text>

              <View className="items-center flex flex-row mt-2">
                <Ionicons
                  name="time-outline"
                  size={21}
                  color="rgba(0, 0, 0, 0.7)"
                />
                <Text
                  className="text-[15px] opacity-70 ml-1"
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                >
                  {resource?.sessionLength} min
                </Text>
              </View>

              <View className="items-center flex flex-row mt-2">
                <Ionicons
                  name="calendar-clear-outline"
                  size={21}
                  color="rgba(0, 0, 0, 0.7)"
                />
                <Text
                  className="text-[15px] opacity-70 ml-1"
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                >
                  {resource?.selectedTime}
                  {", "}
                  {format(resource?.selectedDate, "PPPP")}
                </Text>
              </View>

              <View className="mt-4">
                <Text
                  className="text-[20px]"
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Enter Details
                </Text>
              </View>

              <View className="mt-2">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Name <Text className="text-[20px] text-red-500">*</Text>
                </Text>
                <TextInput
                  autoComplete="name"
                  className="border-2 border-appMain w-full rounded-xl p-2"
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                  onChangeText={(text) => {
                    setResource((data) => {
                      return {
                        ...data,
                        creatorName: text,
                      };
                    });
                  }}
                />
              </View>

              <View className="mt-2">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Email <Text className="text-[20px] text-red-500">*</Text>
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  className="border-2 border-appMain w-full rounded-xl p-2"
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                  onChangeText={(text) => {
                    setResource((data) => {
                      return {
                        ...data,
                        creatorEmail: text,
                      };
                    });
                  }}
                />
              </View>

              <View className="mt-2">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Please share anything that will help prepare for our meeting.
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className={`border-2 border-appMain w-full rounded-xl p-2 ${Platform.OS === "ios" && "h-[63px]"}`}
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                  onChangeText={(text) => {
                    setResource((data) => {
                      return {
                        ...data,
                        notes: text,
                      };
                    });
                  }}
                />
              </View>

              <View className="mt-2">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Phone Number{" "}
                  <Text className="text-[20px] text-red-500">*</Text>
                </Text>
                <TextInput
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  className="border-2 border-appMain w-full rounded-xl p-2"
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                  onChangeText={(text) => {
                    setResource((data) => {
                      return {
                        ...data,
                        phone: text,
                      };
                    });
                  }}
                />
              </View>

              <View className="mt-3">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  Gender
                </Text>
                <View className="mt-1 flex flex-row items-center w-5/12 justify-between">
                  <Pressable
                    className="flex flex-row justify-center items-center"
                    onPress={() => {
                      setResource((data) => {
                        return {
                          ...data,
                          gender: "Male",
                        };
                      });
                    }}
                  >
                    <View className="border border-appMain rounded-full w-4 h-4 justify-center items-center mr-2">
                      {resource?.gender === "Male" && (
                        <View className="w-2 h-2 bg-appMain rounded-full" />
                      )}
                    </View>
                    <Text
                      className=""
                      style={{
                        fontFamily: fonts.fontRegular,
                      }}
                    >
                      Male
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex flex-row justify-center items-center"
                    onPress={() => {
                      setResource((data) => {
                        return {
                          ...data,
                          gender: "Female",
                        };
                      });
                    }}
                  >
                    <View className="border border-appMain rounded-full w-4 h-4 justify-center items-center mr-2">
                      {resource?.gender === "Female" && (
                        <View className="w-2 h-2 bg-appMain rounded-full" />
                      )}
                    </View>
                    <Text
                      className=""
                      style={{
                        fontFamily: fonts.fontRegular,
                      }}
                    >
                      Female
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="mt-3">
                <Text
                  className=""
                  style={{
                    fontFamily: fonts.fontRegular,
                  }}
                >
                  By proceeding, you confirm that you have read and agree to {" "}
                  <Text
                    className=""
                    style={{
                      fontFamily: fonts.fontBold,
                    }}
                  >
                    Calendly's Terms of Use
                  </Text>
                   and
                  <Text
                    className=""
                    style={{
                      fontFamily: fonts.fontBold,
                    }}
                  >
                     Privacy Notice.
                  </Text>
                </Text>
              </View>

              <View className="mt-3">
                <Pressable
                  disabled={processing}
                  className={`${processing ? "bg-gray-300" : "bg-appMain"}  py-3 rounded-lg w-1/2`}
                  onPress={async () => {
                    try {
                      Toast.show({
                        type: "info",
                        text1: "Scheduling Event",
                        text2: `Booking your session with ${resource?.name}. Please wait...`,
                      });
                      setProcessing(true);
                      const currentUser = getCurrentUser();
                      const ref = firestore().collection("appointments").doc();
                      // validate that all fields are filled, don't use if else, use a map instead

                      const payload = {
                        ...omit(resource, ["startTimte", "endTime"]),
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        id: ref.id,
                        timestamp: new Date(),
                        updated: new Date(),
                        selectedDate: firestore.Timestamp.fromDate(
                          resource?.selectedDate,
                        ),
                        title: `Counselling session with ${resource?.name}`,
                      };
                      await ref.set(payload);

                      setStep(1);
                      setResource({});
                      setSelected("reproductive");
                      setCurrentCalendarMonth(new Date());
                      Toast.show({
                        type: "success",
                        text1: "Event Scheduled",
                        text2: `Booked your session with ${resource?.name}`,
                      });
                    } catch (error) {
                      console.log(error);
                    } finally {
                      setProcessing(false);
                    }
                  }}
                >
                  <Text
                    className="text-center text-white"
                    style={{
                      fontFamily: fonts.fontBold,
                    }}
                  >
                    Schedule Event
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default BookACounsellor;
