<script>
    export let routeShortName;
    export let tripHeadsign;
    export let scheduledArrivalTime;
    export let predictedArrivalTime;

    function formatTime(time) {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function getArrivalStatus(predictedTime, scheduledTime) {
        const now = new Date();
        const predicted = new Date(predictedTime);
        const scheduled = new Date(scheduledTime);

        const predictedDiff = predicted - now;
        const scheduledDiff = scheduled - now;

        if (predictedDiff <= 0) {
            return { status: 'early', text: 'arrives ' + Math.abs(Math.floor(predictedDiff / 60000)) + ' min early', color: 'text-red-500' };
        } else if (scheduledDiff <= 0) {
            return { status: 'on time', text: 'arrives on time', color: 'text-green-500' };
        } else {
            return { status: 'late', text: 'arrives ' + Math.floor(predictedDiff / 60000) + ' min late', color: 'text-blue-500' };
        }
    }

    function calculateTimeToReach(predictedTime, scheduledTime) {
        const now = new Date();
        const predicted = new Date(predictedTime);
        const scheduled = new Date(scheduledTime);

        const predictedDiff = predicted - now;
        const scheduledDiff = scheduled - now;

        const chosenTime = predictedDiff >= 0 ? predicted : scheduled;

        return `${Math.floor((chosenTime - now) / 60000)}m`;
    }

</script>

<div class="h-auto bg-[#ffffff] dark:bg-[#1c1c1c] p-4 flex items-center justify-between hover:cursor-pointer hover:dark:bg-[#363636] hover:bg-[#e3e3e3] border-b-[1px] dark:border-[#313135] border-[#C6C6C8]">
    <div class="flex flex-col gap-1">
        <p class="text-xl font-semibold text-black dark:text-white">{routeShortName} - {tripHeadsign}</p>
        <p class="font-semibold text-black dark:text-white">
            <span class="text-md">{formatTime(scheduledArrivalTime)}</span> - 
            <span class="{getArrivalStatus(predictedArrivalTime, scheduledArrivalTime).color}">
                {getArrivalStatus(predictedArrivalTime, scheduledArrivalTime).text}
            </span>
        </p>
    </div>
    <div>
        <p class="text-lg font-semibold text-black dark:text-white">{calculateTimeToReach(predictedArrivalTime, scheduledArrivalTime)}</p>
    </div>
</div>
