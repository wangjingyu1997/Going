import json

param = {
    # 本月的考勤数据
    "current_month_data": "time_02.json",
    # 上月的考勤数据
    "last_month_data": "time_01.json"
}


def load(file_name):
    with open(file_name, 'r', encoding='utf-8') as fp:
        json_dict = json.load(fp)
    return json_dict


def extract_time(data_json_dict: dict, loop_num: range) -> list:
    time_list = []
    data_str = data_json_dict['data']
    for day in loop_num:
        day_str = str(day)
        if day_str in data_str:
            mappings = {
                "start_time": data_str[day_str]["startTime"],
                "end_time": data_str[day_str]["endTime"],
                "work_time": data_str[day_str]["workTime"],
                # "leaveStatus": "1" -- 异常
                "status": int(data_str[day_str]["leaveStatus"])
            }
            time_list.append(mappings)
    return time_list


def calc_time(time_map_list: list) -> list:
    work_time_list = []
    for time_map in time_map_list:
        if time_map["status"] == 1 or time_map['start_time'] is None or time_map['end_time'] is None:
            continue
        time_extra = time_map['work_time'] - 480
        work_time_list.append(time_extra)
    return work_time_list


if __name__ == '__main__':
    data = load(param.get("current_month_data"))
    data2 = load(param.get("last_month_data"))

    time_list_this_month = extract_time(data, range(1, 27))
    time_list_last_month = extract_time(data2, range(28, 32))

    time_list = calc_time(time_list_this_month)
    time_list2 = calc_time(time_list_last_month)

    days_num = len(time_list) + len(time_list2)
    times_count = sum(time_list) + sum(time_list2)
    times_avg = times_count / days_num

    time_total_str = "超时: " + str(times_count) + " min"
    times_str = "正常出勤: " + str(days_num) + " d"
    time_avg_str = "平均: " + str(round(times_avg, 2)) + " min/d"
    print(time_total_str)
    print(times_str)
    print(time_avg_str)
