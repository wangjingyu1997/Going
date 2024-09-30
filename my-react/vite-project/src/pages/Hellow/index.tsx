import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const MyRangePicker: React.FC = () => {
    const [dates, setDates] = useState<Dayjs[] | null[]>([null, null]);

    // 判断是否限制日期
    const disabledDate = (current: Dayjs) => {
        // 如果是开始日期，限制其不能大于今天
        if (!dates || !dates[0]) {
            return current && current > dayjs().endOf('day');
        }
        // 对结束日期不进行限制
        return false;
    };

    return (
        <Space direction="vertical" size={12}>
            <RangePicker
                disabledDate={disabledDate}
                onCalendarChange={(val) => setDates(val)}
            />
        </Space>
    );
};

export default MyRangePicker;