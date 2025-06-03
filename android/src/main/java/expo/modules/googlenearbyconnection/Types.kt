package expo.modules.googlenearbyconnection

import com.google.android.gms.nearby.connection.ConnectionType
import com.google.android.gms.nearby.connection.Strategy
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

class JSAdvertisingOptions: Record {

    @Field
    val connectionType: Int = ConnectionType.BALANCED

    @Field
    val lowPowerMode: Boolean = false

    @Field
    val strategy: String = Strategy.P2P_CLUSTER.toString()

}

class JSConnectionOptions: Record {

    @Field
    val connectionType: Int = ConnectionType.BALANCED

    @Field
    val lowPowerMode: Boolean = false

}

class JSDiscoveringOptions: Record {

    @Field
    val strategy: String = Strategy.P2P_CLUSTER.toString()

}